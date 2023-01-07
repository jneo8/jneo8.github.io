--- 
UID: 202301071458
title: "mermaid - golang DI and CLI builder-202301071458"
tags:
- articles
- golang
- dependency-injection
---

# mermaid - golang DI and CLI builder-202301071458

# Summary

Mermaid is a tool helping user to use dependency injection more easily. By using dig, cobra and viper together.

# Notes

## Project

link: **[mermaid](https://github.com/jneo8/mermaid)**

Mermaid 這個專案的誕生, 是因為自己工作上時常需要寫cli tool而誕生的一個golang專案

介紹Mermaid之前, 可能需要先介紹一些使用場景:

- 希望透過 `-h`, `--username` 類似的指令把參數帶給entrypoint

- 有讀取環境參數或者設定檔的需求

- Logger

- Dependency Injection

- Testing(這很重要)

如果上述需求你有符合, 那你就可以用Mermaid來開發你的程式
下面來說說這個專案的一些想法以及開發過程
最後再說使用方式

---

首先要達到上述的需求會有一些困難需要克服

## Dependency Injection

- DI是可以手動完成的
- 如果你有很多重複性高的指令, 手動注入依舊可行, 但免不了需要寫大量的code, 以及來回驗證參數沒有打錯來確保正確性跟一致性
- 生為一個懶惰的工程師, 直接放棄手動注入(是說一開始我也是手動做的, 手真的會酸)
- 所以 DI 最後選擇透過[dig](https://github.com/uber-go/dig) 這個libary來完成
- 因為使用了DI Libary, 所以如果有參數漏傳或者設定錯誤是會直接噴error的, 間接免去了檢查的時間

## Config

談config 之前, 我們可以先想看看有哪些東西是我們需要處理的範圍

- `Default variable`: Default var, 會寫在程式內

- `Config file`: Config file, e.g., yaml.

- `environment variable`: Get from environment.

- `Input arguments`: From cli args input.

一般來說要符合使用, 引用順序應該會是

**`default` -> `config` -> `environment` -> `input args`**

- 後段的會覆蓋前面的. 這樣的順序應該不論是cli或者container都適用

最後lib 選擇

- `config` & `environment variable`使用的是[viper](https://github.com/spf13/viper)

- `default variable` & `input args` 使用的是 [cobra](https://github.com/spf13/cobra)

而我們為了把所有的設定都給DI, 決定把他變成一個唯一的entity -> [viper.Viper](https://godoc.org/github.com/spf13/viper#Viper). 所以實作上

- `default`, `input args` -> **cobra**
- `config`, `environment` -> **viper**
- **cobra** -> **viper**

後續我們只需要處理**viper**跟**dig**之間的綁定就好

## Logger

為什麼會把 Logger 抽出來說, 是因為我認為一個好的cli tool, 他的Logger需要有一些特點:

- 獨立的entity

    - 大部份的logger lib, 都有一個global的entity
        - 這件事會讓你的測試比較困難, global的東西互相影響不好測試
        - 但如果你每次寫新的command, 都要new一次, 也是滿煩的

    - 不同的component, 不同的logger. 這件事就是看開發或者業務需要

- Customized

    - 算必須. 大部份的lib也都有

Logger lib 是用 [logrus](https://github.com/sirupsen/logrus)


## Testing

global的東西真的不好測試, 所以為了讓東西變得測試容易

- **cobra** 只負責抓default跟args, 還有當進入點. 

- **viper** 基本上runtime才會init, command 之間不會影響

- Logger同上

這樣的意思是說, 每個cmd之間, config跟logger都是獨立的, 這會讓測試變得容易許多


---

# Recap

嗯, 說了一些實作上的想法.
Project本身沒什麼難度, 但其實省去了個人很多的開發時間, 希望大家可以使用看看

最後再附上一次連結
[mermaid](https://github.com/jneo8/mermaid)

---
# References
