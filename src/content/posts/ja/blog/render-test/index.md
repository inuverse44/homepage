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


### 1次の自己回帰モデル 
時系列$y_n$として、1次の自己回帰モデルは

$$
\begin{align}
    y_n = a y_{n - 1} + w_n
\end{align}
$$

と表されるとします。ここで$w_n$は白色雑音(white noise)で、

$$
\begin{align}
    {\rm E}[w_n] &= 0\,, \\
    {\rm Var}[w_n] &= \sigma^2
\end{align}
$$
を満たします。

### 1次の自己回帰モデルで$|a| < 1$ $\Rightarrow$ 弱定常
1次の自己回帰モデル$y_n = a y_{n-1} + w_n$で$|a| < 1$ならば弱定常であることを示します。上記のセクションで言及したように、弱定常性をいうには期待値、分散、共分散関数が時間$n$に依存しないことを示せばいいです。

#### (i)
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

です。$k \to \infty$が近似的に成立する程度に長い時系列を考えています。これの期待値をとると、

$$
\begin{align}
    {\rm E}[y_n] 
    &= {\rm E} \left[
        a^k y_{n-k} + \sum_{j = 0}^{k-1} a^j w_{n-j}
    \right] \notag \\
    &= a^k {\rm E} [y_{n-k}]
    + \sum_{j=0}^{k-1} a^{j} E[w_{n-j}] \notag \\
    &= a^k E[y_n] \underset{k\to\infty}{\longrightarrow} 0
\end{align}
$$

となります。２行目で白色雑音の定義、３行目では$|a| < 1$の条件を使用しています。


#### (ii)
次に分散を考えます。これもまた、期待値同様に$k \to \infty$が近似的に成立する程度に長い時系列を考えています：

$$
\begin{align}
    {\rm Var}[y_n]
    &= {\rm Var} \left[
        \sum_{j=0}^\infty a^j w_{n-j}
    \right] \notag \\
    &=  \sum_{j=0}^\infty (a^j)^2 {\rm Var} [w_{n-j}] \notag \\
    &= \sigma^2 \sum_{j=0}^\infty (a^j)^2 \notag \\
    &= \frac{\sigma^2}{1 - a^2}
\end{align}
$$

これは定数、つまり時間に依存しませんので${\rm Var}[y_n] = {\rm Var}[y_{n-k}]$を満たします。

#### (iii)
最後に自己共分散がラグ$k$のみに依存することを示します。$k > 0$として、定義より

$$
\begin{align}
    C_k
    &= {\rm E} [(y_n - \mu) (y_{n-k} - \mu)] \notag \\
    &= {\rm E} [y_n y_{n-k}] \notag \\
    &= {\rm E} [(a y_{n-1} + w_n) y_{n-k}] \notag \\
    &= a {\rm E} [y_{n-1} y_{n-k}] + {\rm E}[w_n y_{n-k}] \notag \\
    &= a {\rm E} [y_{n-1} y_{n-k}] \notag \\
    &= a C_{k-1} = a^2 C_{k-2} = \cdots = a^k C_0 \notag \\
    &= a^k {\rm Var}[y_n] \notag \\
    &= a^k \frac{\sigma^2}{1 - a^2}
\end{align}
$$

と計算できます。よってラグ$k$のみに依存し、時刻$n$には依存しません。

以上(i)(ii)(iii)より、1次自己回帰モデルは弱定常であることが導けます。


### １次の自己回帰モデルにおいて弱定常　$\Rightarrow$ $|a| < 1$
弱定常の1次自己回帰モデルならば$|a| < 1$を満たす、ということの待遇は、$|a| \geq 1$ならば非定常である、ということを示せばよいです。

#### (i)
$a = 1$のときを考えてみます（これはちょうどランダムウォークを考えている）。つまり、

$$
\begin{align}
    y_n = y_{n-1} + w_n 
    = y_0 + \sum_{i=0}^n w_i
\end{align}
$$

です。この分散は

$$
\begin{align}
    {\rm Var}[y_n]
    &= {\rm Var} \left[
        y_0 + \sum_{i=0}^n w_i
    \right] \notag \\
    &= {\rm Var}[y_0] + \sum_{i=0}^n {\rm Var}[w_i] \notag \\
    &= {\rm Var}[y_0] + n\sigma^2
\end{align}
$$

であります。これは$n$に依存していますので非定常です。

#### (ii)
$|a| > 1$に対して、もし定常であれば$C_0 = \sigma^2/(1-a^2)$です。この仮定より$C_0 < 0$となりますが、$C_0 \geq 0$であることから矛盾が生じます。

#### (iii)
(ii)と同様に、定常であれば$C_0 = \sigma^2/(1-a^2)$です。しかし、これは発散してしまいますので、分散が定義できません。

したがって、(i)(ii)(iii)より$|a| \geq 1$であれば非定常、つまり弱定常ならば$|a| \leq 1$であることを示せました。

## $C_k = \sigma^2 (1 - a^2)^{-1} a^{|k|}$の導出

$y_n$の分散を求めます：

$$
\begin{align}
    {\rm E}[{y_n^2}]
    &= {\rm E}[ (ay_{n-1} + w_n)^2 ] \notag \\
    &= a^2 E[y_n^2] + a E[y_n w_n] + E[w_n^2] \notag \\ 
    &= a^2 C_0 + \sigma^2
\end{align}
$$

であるから、$C_0 = a^2 C_0 + \sigma^2$です。よって

$$
\begin{align}
    C_0 
    = \frac{\sigma^2}{1 - a^2}
\end{align}
$$

です。このまま自己共分散関数を求めると、

$$
\begin{align}
    C_k
    &= E[y_n y_{n-k}] \notag \\
    &= E[(ay_{n-1} + w_n)y_{n-k}] \notag \\
    &= a E[y_{n-1} y_{n-k}] + E[w_n y_{n-k}]  \notag \\
    &= a C_{k-1} \notag \\
    &= a^2 C_{k-2} = \cdots = a^k C_0 \notag \\
    &= a^k \frac{\sigma^2}{1 - a^2}
\end{align}
$$

となります。
ここでは、$k > 0$を仮定していますが、$C_k$の定義より$C_k = C_{-k}$なので

$$
\begin{align}
    C_k
    = \frac{\sigma^2}{1 - a^2} a^{|k|}
\end{align}
$$

が導かれます。


## 参考文献
https://www.iwanami.co.jp/book/b265410.html