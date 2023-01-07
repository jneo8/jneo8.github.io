--- 
UID: 202301071508
title: "ClickHouse Index-202301071508"
tags:
- articles
- clickhouse
- database-index
---

# ClickHouse Index-202301071508

# Summary

How Clickhouse index work?

# Notes

介紹 Index 前, 先介紹一下 Clickhouse MergeTree 的儲存結構

## Partition

一個 Partition 可以有多個 parts. Clickhouse 每次 bulk insert 都會產生新的 part file, 相同 Partition 的 part 會在 insert 完後 10-15分鐘 merge, 合併一個 part file

Partition Format 有兩種: `Wide`, `Compact`

* `Wide`: Column 分開儲存, default.
* `Compact`: 所有 Column 一起儲存, 適合頻率大, 小量的 insert.

文件中有一段話講 partition key 的設計

> A merge only works for data parts that have the same value for the partitioning expression.
>
> This means you shouldn’t make overly granular partitions (more than about a thousand partitions). Otherwise, the SELECT query performs poorly because of an unreasonably large number of files in the file system and open file descriptors.

白話就是 partition 在 table 內不應該過多, 會降低 select 效能. 自己的心得就是針對不同的 data source 選擇適合的 partition key 可以有效改善效能瓶頸

## Primary Key

跟一般 RMDB 不同的是, Clickhouse Primary Key 並沒有表示重複數據的意思.
而是依照 Primary Key 排序. 由於 Clickhouse 內可以設定多個 Primary Key, 比如說 __(Area, UserID)__, 表示說 Part 內數據先依照 __Area__ 排序, __Area__ 內再依照 __UserID__ 排序.

### Granules

Granules 是 Clickhouse data 的最小單位, granules 包含一個數量的 rows. Clickhouse 會拿 granules 第一筆資料的 Primary Key 當 mark.

* 針對每個 Part, 會有個 index file `.idx` 儲存這些 mark value.

* 針對每個 Columns, 就算不是 Primary Key, 也會儲存這些 mark. `.mrk` (透過 mark 在 column file 找資料)

> * `.idx` 存這些 mark value, `.mrk` 則是存兩個偏移值 `.bin 的偏移值定位到 compressed block` & `compressed block 解壓後的文件偏移量`

### Block

Block 是 Clickhouse Column 的壓縮單位, 包含多個 Granules, 至於是多少要看 [min_compress_block_size](https://clickhouse.tech/docs/en/operations/settings/settings/#min-compress-block-size) & [max_compress_block_size](https://clickhouse.tech/docs/en/operations/settings/settings/#max-compress-block-size)決定.

* 每次寫入一個 Granules (default `index_granularity` 8192 rows), Clickhouse 會檢查 data size
    * 如果 < `min_compress_block_size` 會繼續拿取 data
    * 如果 > `min_compress_block_size` & < `max_compress_block_size` 會壓縮並寫入磁碟
    * 如果 > `max_compress_block_size`, 會依照 `compress_block_size` 截斷並生成 block

一個 `.bin (Date file)` 內包含多個 compress block


結構圖如下:

![](/img/clickhouse/clickhouse-mergetree-layout-within-a-single-part.jpg)

---

## Index

所以 Select Index 如何發揮作用呢 ？

* Create Table T ORDER BY A
    * A 有 Primary Index, B 沒有

```sql
CREATE TABLE T(A Int, B Int) MergeTree order by A
```

* 這邊 insert 三次, 所以會有三個 part 產生

```sql
insert into T values(1, 1)
insert into T values(2, 1)
insert into T values(1, 2)

select database, table, name, primary_key_bytes_in_memory, marks_bytes, rows  from system.parts where table = 'T'

```

```
┌─database─┬─table─┬─name──────┬─primary_key_bytes_in_memory─┬─marks_bytes─┬─rows─┐
│ default  │ T     │ all_1_1_0 │                           8 │          80 │    1 │
│ default  │ T     │ all_2_2_0 │                           8 │          80 │    1 │
│ default  │ T     │ all_3_3_0 │                           8 │          80 │    1 │
└──────────┴───────┴───────────┴─────────────────────────────┴─────────────┴──────┘
```

* 開啟 Tracing

```sql
set send_logs_level = 'trace'
```


* 針對 B 做 Query

```sql
SELECT * FROM T where B > 1
```

```
... <Debug> executeQuery: (from 127.0.0.1:53134) select * from T where B > 1
... <Trace> ContextAccess (default): Access granted: SELECT(A, B) ON default.T

// primary index 沒作用

... <Debug> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Key condition: unknown
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Not using primary index on part all_1_1_0
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Not using primary index on part all_2_2_0
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Not using primary index on part all_3_3_0

// Clickhouse 掃過全部三個 Partition

... <Debug> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Selected 3 parts by partition key, 3 parts by primary key, 3 marks by primary key, 3 marks to read from 3 ranges
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Reading approx. 3 rows with 3 streams
... <Trace> InterpreterSelectQuery: FetchColumns -> Complete
┌─A─┬─B─┐
│ 1 │ 2 │
└───┴───┘
... <Information> executeQuery: Read 3 rows, 24.00 B in 0.004743004 sec., 632 rows/sec., 4.94 KiB/sec.
... <Debug> MemoryTracker: Peak memory usage (for query): 0.00 B.

1 rows in set. Elapsed: 0.007 sec. 

```

```sql
SELECT * FROM T where A > 1
```

```
... <Debug> executeQuery: (from 127.0.0.1:53134) SELECT * from T where A > 1
... <Trace> ContextAccess (default): Access granted: SELECT(A, B) ON default.T

// 找到 Primary key, 透過找 LEFT/RIGHT boundary 選擇 partition

... <Debug> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Key condition: (column 0 in [2, +inf))
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Running binary search on index range for part all_2_2_0 (2 marks)
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Running binary search on index range for part all_1_1_0 (2 marks)
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Found (LEFT) boundary mark: 1
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Found (RIGHT) boundary mark: 2
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Found (LEFT) boundary mark: 1
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Found empty range in 1 steps
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Found (RIGHT) boundary mark: 2
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Found empty range in 1 steps
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Running binary search on index range for part all_3_3_0 (2 marks)
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Found (LEFT) boundary mark: 0
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Found (RIGHT) boundary mark: 2
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Found continuous range in 2 steps

// 這邊顯示只選到 1 個 partition

... <Debug> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Selected 3 parts by partition key, 1 parts by primary key, 1 marks by primary key, 1 marks to read from 1 ranges
... <Trace> default.T (9eae30d1-c8fa-4630-af28-88484187ddbe) (SelectExecutor): Reading approx. 1 rows with 1 streams
... <Trace> InterpreterSelectQuery: FetchColumns -> Complete
┌─A─┬─B─┐
│ 2 │ 1 │
└───┴───┘
... <Information> executeQuery: Read 1 rows, 8.00 B in 0.005239063 sec., 190 rows/sec., 1.49 KiB/sec.
... <Debug> MemoryTracker: Peak memory usage (for query): 0.00 B.
```

### 所以整個過程是什麼 ?

1. Partition Key -> Partition
2. Mark LEFT/RIGHT -> 選 Partition
3. Primary key 找符合條件的 marks
4. mark -> 要讀取的範圍

Clickhouse Primary Index 是 Sparse Index, 針對特定 row 的 query 基本上很慢 (看整段過程就知道了), 但對條件過濾就友善很多了.

所以 Clickhouse Index 的概念是什麼？

*如何跳過更多的資料, 找到需要掃過的範圍*

跳過的 Block 多了, 解壓縮的 Block 就少了. 可以很大程度的減少 I/O.

就像切蛋糕, 看能夠切幾刀找到需要的資料

## Tips

* Unique: 避免太獨特的 primary key, 效果會很差

* Long data range: 反之太常見的 Primary key 就會失去效果, 需要掃過的 range 過長

* Primary Key 順序: Order by (A, B, C) or (B, A, C). 因為是 Sparse Index, 如果順序錯了有機會多讀取很多資料. 慎重考慮 query 條件 && Primary Key 的設定

* 事後加入 Data Skipping Index, 對已經存在的資料並不會馬上發生作用. 而是需要 Part merge process 跑完後才會生效

* 預設的 `min_compress_block_size` & `max_compress_block_size` 已經優化過了, 沒事別動.

---

# References

https://www.slideshare.net/Altinity/webinar-secrets-of-clickhouse-query-performance-by-robert-hodges-173379008
https://stackoverflow.com/questions/60255863/how-understand-the-granularity-and-block-in-clickhouse
https://github.com/ClickHouse/ClickHouse/issues/7473
https://stackoverflow.com/questions/60142967/how-to-understand-part-and-partition-of-clickhouse
https://www.wangfenjin.com/posts/clickhouse-od/
