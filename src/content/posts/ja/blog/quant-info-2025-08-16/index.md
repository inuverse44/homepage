---
title: "Shannon情報量とvon Neumann情報量の関係"
date: "2025-08-16T22:00:00+09:00"
tags: ["量子情報", "Shannon情報量", "von Neumann情報量"]
description: "Shannon情報量の自然な量子論への拡張がvon Neumann情報量なのかを考える"
lang: "ja"
draft: false
hero: "/images/quant-info.jpg"
---

## Shannon情報量

確率変数$X$に対する確率分布$P(X)$に対し、Shannon情報量H(P)を次で定義しましょう：
$$
\begin{align}
    S(P) := - \sum_{x \in X} P(X=x) \ln P(X=x)
\end{align}
$$

この定義は主に次のような動機から要請されます。
- (i) 情報量$S(P)$は$P$の減少関数である
- (ii) 情報量$S(P)$は$P$に対して連続である
- (ii) 加法性を満たすである


(i)について、情報はありふれた事象($P$が大きい)ときには小さくなるだろうという気持ちを表しています。
例えば、宝くじ、競馬、競艇、パチンコといったギャンブルで負けるというイベントは、日常的にごくごく普通にありふれており、
辛い気持ちになっている人間がいるということは珍しい話ではないし、なんの興味も持たれないでしょう。一方、ギャンブルで勝てば（つまり
確率$P$が小さいとき）ある一定のコミュニティ（友人間や会社間、あるいはニュース）レベルで大きな話題になります。

つまり、情報とは $ \propto P^{-1} $ であると考えられます。

(ii)について、確率によって情報量が飛び飛びの値をとるのは直感的には受け入れらない気持ちを表しています。
情報量がある一点の$P_\ast$だけ階段関数のようになっているとしよう。$[0, P_\ast]$までは0をとり、$(P_\ast, 1]$で1を
とるものだとすると、$P_\ast$の情報量がある一点を境に急に情報を獲得したように見えてしまいます。
以下で考える情報量のとりかたは$P$に対して飛び飛びな値を取ることがないことを保証する、として議論します。

(iii)については、情報量は足し算ができるべきだ、という気持ちを表しています。競馬であてて、競艇でもあてたら、
それぞれ単独で当てた話題性はより大きいものになるでしょう。単純に数学的に2つの独立に生じるイベントに対する確率がそれぞれ$P^{-1}_1, P^{-1}_2$であるとして、
両者を足しても$\propto P_1 P_2 / (P_1 + P_2)$のような形式になり、元の形式である$(P_1 + P_2)^{-1}$にはならない。よって、$H(P_1 P_2) = H(P_1) + H(P_2)$
を満たして欲しいのです。


## von Neumann情報量

### 演算子の関数の表現
演算子$\hat{A}$をスペクトル分解すると
$$
\begin{align}
    \hat{A} = \sum_k \bar{a}_k \hat{P}_{\bar{a}_k}
\end{align}
$$
と表される。$\hat{P}_{\bar{a}_k}$は$\bar{a}_k$が属する固有空間の射影演算子である。
このとき$f(\hat{A})$を次で定義する。
$$
\begin{align}
    f(\hat{A})
    = \sum_k f(\bar{a}_k) \hat{P}_{\bar{a}_k}\,.
\end{align}
$$
つまるところ、スペクトル分解されたときの固有値に対して関数を作用させるだけです。


## von Neumann情報量の定義
von Neumann情報量の定義は密度演算子を$\hat{\rho}$として
$$
    S(\hat{\rho})
    = {\rm Tr} \hat{\rho} \ln \hat{\rho}
$$
とかけます。

$\hat{\rho}$の固有値を$\xi_k$、それに属する固有関数を$\ket{\xi_k}$とします。
スペクトル分解すると
$$
    \hat{\rho}
    = \sum_k \lambda_k \ket{\xi_k}\bra{\xi_k}
$$
とできます。$\ket{\xi_k} \bra{\xi_k}$は$\lambda_k$が属する固有空間への射影演算子です。

この表現を使うことで、
$$
\begin{align}
    S(\hat{\rho})
    &= - {\rm Tr}\left[
        \sum_k \lambda_k \ln \lambda_k \ket{\xi_k} \bra{\xi_k}
    \right] \notag \\
    &= - \sum_k \lambda_k \ln \lambda_k {\rm Tr} \left[
        \ket{\xi_k} \bra{\xi_k}
    \right] \notag \\
    &= - \sum_k \lambda_k \ln \lambda_k
\end{align}
$$
とも表現できます。



## 参考文献

- [細谷曉夫, 量子と情報, (2024), 昇華房](https://www.shokabo.co.jp/mybooks/ISBN978-4-7853-2515-2.htm)
- [小川朋宏, 量子情報数理特論, 電気通信大学 大学院情報理工学研究科](http://www.quest.lab.uec.ac.jp/ogawa/qmath2020/qmath20200722.pdf)
- [理数アラカルト　行列のスペクトル分解を解説   ～証明と具体例～](https://risalc.info/src/spectral-decomposition-matrix.html)
