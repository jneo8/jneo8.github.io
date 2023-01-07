--- 
UID: 202301071505
title: "golang project architecture-202301071505"
tags:
- articles
- golang
- project-structure
---

# golang project architecture-202301071505

# Summary

結構化的 Golang project 設計

# Notes

這是個老議題了, 但最近在網路上看到滿多教學文在講 project setup

還是來分享一下自己目前的理解跟設計

## 專案架構

```bash
.
├── assets
├── bin
├── build
├── CHANGELOG.md
├── cmd
│   ├── demo1
│   │   └── main.go
│   └── demo2
│       └── main.go
├── configs
├── deployment
├── docs
├── entity
├── go.mod
├── go.sum
├── infra
├── Makefile
├── pkg
├── README.md
├── repository
├── scripts
└── usecase

```

## Entity Layer

### /entity

* 在說明 entity 放什麼之前, 先看一下 entity 的 解釋

    > __Entities encapsulate Enterprise wide business rules. An entity can be an object with methods, or it can be a set of data structures and functions. It doesn’t matter so long as the entities could be used by many different applications in the enterprise. If you don’t have an enterprise, and are just writing a single application, then these entities are the business objects of the application. They encapsulate the most general and high-level rules. They are the least likely to change when something external changes. For example, you would not expect these objects to be affected by a change to page navigation, or security. No operational change to any particular application should affect the entity layer.__

* 所以 entity 是什麼 ?
    * 是最高級的實體, 包含一些針對實體的 function
    * 變動最小 (你不會希望你到處引用的 struct 一直被修改)
    * 因為是最高層的, 不會引用別人, 會被各個 application 引用
    * entity 並不包含 database/service/application, 是最簡單的封裝

## Drivers

### /repository

* Repository Pattern

* 通常都是定義好對應的 interface 再用某個 Datebase 去實做, 好處是可以隔離 db & service. 例如 usecase 使用 repository, 對他來說就看不見下層的 Database.

* 個人覺得有個麻煩的地方就是雖然有辦法抽換 Database, 但如果初期沒有規劃好 interface 的話, 有可能會變成看似隔開了但其實沒有. 比較好的訣竅可能是在設計 Repository 時不應該針對特定 Database. 自己是覺得這方面自己做的不太好就是了.
    * 另外就是抽換真的很麻煩, 需要實做 interface, 評估效能..etc.

## Usecase Layer

### /usecase

* 基本上業務邏輯會被集中在這層, 通常是放 Service
* 改動程度最大

## Interface Adopters Layer

### /cmd

* Main application package
* 相較有些 project 會把 main.go 放在根目錄, 如果你的 application 需要多個 binary(只有一個也沒關係), 個人認為 cmd 是更好的選擇.
* 這邊通常不會有太多 business logic, 主要都只有CLI, 讀取設定, Dependency injection 和 service 啟動的簡單邏輯
* 編譯完的 binary 都會放到 /bin

### /api

* API Documents OpenAPI/Swagger
* Router / Middleware / httputils
* Examples
    * https://github.com/moby/moby/tree/master/api

## Support packages

### /pkg

* logging/file handling/encryption, etc.
* 其它 package(api/usecase/cmd)可以引用
* 不是核心業務邏輯
    * 這部份私人認為判斷上有其難度, 如何切分業務邏輯, 這也是每個 Engineer 要下的決定

## Common projects directories

### /config

* 設定用的 yaml

### /docs

* 嗯, 就是文件

### /infra

* 快速的 Infrastructure setup
* 有些教學會把 repository 放進來, 但個人認為一個完整的 project 可能會需要設定開發or測試時所需要的 infrastcture, 比如說某個Database, 這邊主要放這些 setup 的 tools/scripts.

### /assets

* 靜態文件

### /bin

* 放編譯完的執行檔

### /Scripts

* Shell script files
* 避免 Makefile 過於肥大, 太過複雜的 script 就放這

### /deployments or /deploy

* 主要是部署文件
* docker-compose
* kubernetes/helm
* mesos
* terraform

### /build

* Build/CI scripts and config
* CI config & scripts -> `build/ci`
    * 有些 CI 會指定檔案位置, 如果可行的話儘量擺這 

### /test

* Cross-functional test suites

# Recap

這是大多數在工作上常用的配置, 好處是因為有依照 clean architecture 去切分 package, 大多數的改動只需要動到單一幾個package.
會讓 PM 產生一種你 code 寫很快的錯覺.
另外要廢言一下怎麼評估自己的 project 切分的好不好

* 對新人的易上手程度
    * 設計上就是簡單易懂就好
    * 文件 +　Script 的完整度
    * 變相降低 switch 成本
* Business rule 切分
    * 這滿吃經驗的, 自己也是學習中
* Dependency Injection
    * DI 做的好, 測試沒煩惱
    * 抽象程度的拿捏也需要經驗跟練習

最後要說, 大多數時間 project 都不是完美的架構, 可能需要經過時間跟專案複雜度微調
就像一些實驗性的 project 可能就不會這樣完整
架構也是慢慢發展起來

---

# References

* https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
* https://eltonminetto.net/en/post/2020-07-06-clean-architecture-2years-later/
* https://github.com/golang-standards/project-layout
