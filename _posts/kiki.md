---
title: "Kiki: Flashcard Web App based on Anki"
excerpt: "I built Kiki, a Flashcard App powered by the famous Anki flashcards App"
coverImage: "/assets/blog/dok/cover.png"
date: "2024-12-03T05:35:07.322Z"
author:
  name: Tim Gu
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/kiki/dok/cover.jpg"
---
Over the years, I have greatly enjoyed using the power [Anki](https://github.com/ankitects/anki) flashcard app -- or rather, the Android version of it, [Ankidroid](https://github.com/ankidroid/Anki-Android). It is by far the best flashcard app available on the platform, featuring a rich set of features, a vast collection of shared libraries on line, and an extremely well tuned review algorithm that helps you memorize the card without taking too much of your time. It is just so easy to utilize all these fragmented pieces of time and learn anything on the go. Anki helped me pass 3 driver's tests, got me into college, aided me in graduating the said college, and even taught me enough Japanese to watch anime without subtitles.

Whenever I have the chance, I always recommend Anki to family and friends. However, one gripe I have always had is that as awesome and Ankidroid is, there is no equivalent of it on the IOS platform. Okay, this statement might be a little inaccurate. If you are an IOS user and you wanted to use Anki, you have 2 choices, either use the AnkiWeb, which is the web companion of Anki from the original deskop app developer with a neutered set of functionalities that pretty much requires a desktop version to use, or, pay $20 for Anki IOS with a similar set of features. 

As a result, for the longest time, I have just accepted the fact IOS has no Anki. However, recently, I decided to revisit this issue. I dived into the source code of Anki again, and to my pleasant surprise, I discovered that it was much easier than I had previously thought to create and host an online version of Anki that shares the same rich feature set of the desktop app. So I began working, and after a few weeks of tinkering, I am pleased to announce that the alpha version of Kiki -- a web-based flashcard app powered by Anki -- is now officially online. In this blog, I will briefly introduce Kiki before diving into the details how it was built.
