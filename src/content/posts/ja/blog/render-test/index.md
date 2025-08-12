---
title: "時系列解析入門備忘録　１次の自己回帰モデルについて"
date: "2025-08-12T09:40:00+09:00"
tags: ["時系列解析", "数学", "物理"]
description: "１次の自己回帰モデルについて、弱定常性や共分散関数の導出を議論します。"
lang: "ja"
draft: false
hero: "/images/render-test-hero.svg"
---

## はじめに
この記事では
https://www.iwanami.co.jp/book/b265410.html
を参考にしています。

第3章のp29にて

> 例　自己回帰モデルのスペクトル
> $w_n$を分散が$\sigma^2$の白色雑音とする。時系列が$y_n = a y_{n-1} + w_n$（１次の自己回帰モデル）に従って生成されている場合には、自己共分散関数は$C_k = \sigma^2 (1 - a^2)^{-1} a^{|k|}$で与えられる。

とあります。自己共分散関数が天下り的に与えられていました。ちょっと分からなかったので、時系列が$y_n = a y_{n - 1} + w_{n}$（$w_n$は白色雑音）のとき、

$$
\begin{align}
    C_k 
    = \sigma^2 (1 - a^2)^{-1} a^{|k|}
\end{align}
$$
を導出します。


## 準備
### 自己共分散関数の定義
自己共分散関数は次で与えられます。時系列を$y_n$としたとき、

$$
\begin{align}
    C_k 
    = {\rm E}[ (y_n - \mu_n)(y_{n-k} - \mu_{n-k}) ]
\end{align}
$$

です。ここで、${\rm E}[\cdot]$は期待値を表し、$\mu_n$は$\mu_n = E[y_n]$を表します。

### 弱定常の定義
時系列が弱定常であるとは、期待値、分散、共分散が次を満たすことです。

$$
\begin{align}
    {\rm E}[y_n] &= {\rm E}[y_{n-k}] = \mu = {\rm const.} \\
    {\rm Var}[y_n] &= {\rm Var}[y_{n - k}] = {\rm const.} \\
    {\rm Cov}[y_n, y_m] &= {\rm Cov}[y_{n - k}, y_{m - k}] = {\rm const.} \\
\end{align}
$$

ここで、分散、共分散はそれぞれ${\rm Var}[y_n] = E[(y_n - \mu)^2], {\rm Cov}[y_n, y_m] = {\rm E}(y_n - \mu)(y_m - \mu)]$と、具体的に期待値の表記で書かれます。

3つ目の共分散が定数であるという条件は、共分散関数

$$
\begin{align}
    C_k := {\rm Cov}[y_n, y_{n - k}]
\end{align}
$$

が、ラグ$k$のみに依存することと等価です。時間$n$には依存しません。


### 1次の自己回帰モデルで$|a| < 1$ $\Rightarrow$ 弱定常
1次の自己回帰モデル$y_n = a y_{n-1} + w_n$で$|a| < 1$ならば弱定常であることを示します。上記のセクションで言及したように、弱定常性をいうには期待値、分散、共分散関数が時間$n$に依存しないことを示せばいいです。

まずは期待値を考えます。$y_n = ay_{n-1} + w_n$を順々に用いることで

$$
\begin{align}
    y_n 
    &= ay_{n-1} + w_n \notag \\
    &= a(ay_{n-2} + w_{n-1}) + w_n = a^2 y_2 + a w_{n-1} + w_n \notag \\
    &\vdots \notag \\
    &= a^k y_{n-k} + \sum_{j = 0}^{k-1} a^j w_{n-j}
\end{align}
$$

です。これの期待値をとると、

$$
\begin{align}
    {\rm E}[y_n] 
    &= {\rm E} \left[
        a^k y_{n-k} + \sum_{j = 0}^{k-1} a^j w_{n-j}
    \right] \notag \\
    &= a^k {\rm E} [y_{n-k}]
    + \sum_{j=0}^{k-1} a^{j} E[w_{n-j}]
\end{align}
$$



### １次の自己回帰モデルにおいて弱定常　$\Rightarrow$ $|a| < 1$

## $C_k = \sigma^2 (1 - a^2)^{-1} a^{|k|}$の導出


## 参考文献
https://www.iwanami.co.jp/book/b265410.html