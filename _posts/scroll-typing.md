---
title: "Learn how to make a scroll-typing effect with Framermotion + Tailwind + Next.js"
excerpt: "So, on my porfolio website, there is a scroll-typing effect on the homepage under the skill section. I have gotten a few questions from friends about how I made it, so I thought I would write a blog post about it!"
coverImage: "/assets/blog/scroll-typing/cover.png"
date: "2024-12-01T05:35:07.322Z"
author:
  name: Tim Gu
  picture: "/assets/blog/authors/tim.jpeg"
ogImage:
  url: "/assets/blog/hello-world/cover.jpg"
---

So, on my __[portfolio](https://timgu.me)__ website, there is a scroll-typing effect on the homepage under the skill section. I have gotten a few questions from friends about how I made it, so I thought I would write a blog post about it!

## What is a scroll-typing effect?

A scroll-typing effect is when text is typed out as you scroll down the page. It is a cool little visual effect that I thought would fit into the theme of my portfolio really well. It looks like this:

![Scroll-typing effect](/assets/blog/scroll-typing/scroll-typing.gif)

which I think is pretty neat.

## So how do you make it?

### The ingredients

The website itself is built with Next.js, and the scroll-typing effect is made with Framer Motion and Tailwind CSS, so this tutorial will be focused on those technologies. If you are not familiar with them, I would recommend checking out the official documentation for [Next.js](https://nextjs.org/), [Framer Motion](https://motion.dev), and [Tailwind CSS](https://tailwindcss.com/). I would also recommend a dash of JavaScript and React knowledge, as these will be essential for understanding the mechnasim.

There are mainly three parts to making this effect work. First, we need a way to capture the mouse scroll event. Then we need to find a way to override the default scrolling behavior just for this section of the page. Finally, we need to make the animation itself.

### Step 1: Capturing the scroll event

Normally, when you scroll down a page, the browser will scroll the page for you. However, in our case, we want to override this behavior and repurpose it. Normally, this is done by listening to the `wheel` event on the window object, but in our case, we can use Framer-motion's built-in scroll event listener `useScroll` to make things easier. Check out the documentation [here](https://motion.dev/docs/react-use-scroll).

Here is a high level overview of how you can use it:
```jsx
import { useScroll } from 'framer-motion';
export default function Home() {
  const refContainer = useRef(null);
  const refSkills    = useRef(null);

  const {scrollYProgress: scrollSkills } = useScroll({container: refContainer, target: refSkills, offset: ["0 0.1", "1 1"]});
...
}
```
The first line is pretty self-explanatory, we are importing the `useScroll` hook from Framer-motion. In our main function, we then create `refContainer` and `refSkills` using the `useRef` hook in react. Refs are a way to reference a DOM element in React, and in this case, "refContainer" refers to the top-level container of the page, which looks something like this:
```js
<div ref={refContainer} className=" h-screen overflow-y-scroll 
    overflow-x-hidden bg-primary-black -z-10">
...
</div>
```
Note that the container is set to be the height of the screen, and it is scrollable. This will be important in later.

The `refSkills` refers to the section of the page where the scroll-typing effect is going to happen. In my case, it is the skills section, but you can replace it with any section you want. 

The `useScroll` essentially returns a `scrollYProgress` object that can be queried to return a value between 0 and 1 that represents the scroll progress between two DOM elements. The hook takes in a few parameters, but the most important ones are `container` and `target`. The `container` is the ref to the top-level container of the page, and the `target` is the ref to the section where the scroll-typing effect is going to happen.

Perhaps the most confusing part would be the "offset", which describes where the the scroll value starts and ends in terms of the relative position of the two elemets. In our case, we want the scroll-typing effect to start when the top of the section just a *bit* past the top of the screen, which is represented by "0 0.1", and end when the bottom of the section is just right at the bottom of the screen, which is represented by "1 1".

![scroll-intersection](/assets/blog/scroll-typing/image1.png)

Okay now, we have the scroll value `scrollSkills`, We are now halfway there! The second half of the battle, is to stop the default scroll behavior.

### Step 2: Stoping the default scroll behavior
When we scroll, we want the typing text to appear stationary. A quick google search will reveal a myriad ways of achieving this, the most common being to prevent the default behavior of the `wheel` event. However, personally, I find that in general, these methods are not very reliable and is a pain to work with, especially if you want your code to be mobile friendly. Instead, I choose to simply overaly a transparent div on top of an aboslutely positioned div that contains the text. This way, the page will inherit all regular scroll behavior, but the text will not be affected and stay in pace as "background" text.

The code for this is pretty simple:
```jsx
<div className="relative -z-8">
  <Skills scroll={scrollSkills}/>
  <div className="absolute top-0 w-screen h-[200rem] 
  bg-transparent z-10">
  <div id={"skills"} className="relative w-screen 
    h-screen bg-transparent z-10 top-[120rem]"/>
  </div>
</div>
```
Here, we have a `Skills` component that takes in the scroll value as a prop. The `Skills` component is where the text is going to be displayed and is fixed in position. Right beneath it, the `absolute` div is the overlay that is going to prevent the text from moving when we scroll. Finally, the `id={"skills"}` div is simply an *anchor* that allows the user to quickly navigate to the fully-displayed list of skills. `top-[120rem]` is just a random value that I found to work well for the scroll position that shows the end-result of the text. 

We need a few more additional configurations inside the `Skills` to make it display the text correctly,

```jsx
export default function Skills({scroll: scrollParent}:
{scroll: MotionValue<number>}) {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const unsubscribe = scrollParent.on("change", (latest) => {
      if (latest == 0 || latest == 1){
        setHidden(true);
      }else {
        setHidden(false);
      }
    })
    return () => {
      unsubscribe();
    }
  })
  ...
}
```
Here, we are using the `useState` and `useEffect` hooks to keep track of the scroll value and hide the text when the scroll value is at the top or the bottom. The `scrollParent` is the scroll value that we passed in from the parent component. This ensures that the Skills component does not show up until we are entering its section, and disappears when we are leaving. Otherwise, the text would be displayed all the time, which is not what we want.

Finally, the returned element itself is going to look something like this:
```jsx
return <AnimatePresence>
      {!hidden && (<motion.section className="fixed ..." ... >
        ...
        </motion.section>
      )}
  </AnimatePresence>
```
AnimatePresence is a component from Framer-motion that allows us to animate the entrance and exit of the text. The `motion.section` is where the text is going to be displayed, and we set it to "Fixed" to keep it in palce. Finally, we use the `hidden` state which we set in the earlier snippet to conditionally render it.

### Step 3: Animating the text
The final step is to animate the text as if it is being typed out. We are going to start by creating a custom animation that types out a single character at a time. The code for this is going to look something like this:
```jsx
function TypingChar({char, index, len, start, end, scroll}:
    {char: string, index:number, len: number, start:number, end:number, scroll: MotionValue<number>}) {
    const [show, setShow] = useState("none");
    useEffect(() => {
        const unsubscribe = scroll.on("change", 
        (latest) => {
            if (latest > index/len*(end-start)+start) {
                setShow("inline-block");
            }else{
                setShow("none");
            }
        })
        return () => {
            unsubscribe();
        }
    })
    if (char == " ") {
        return (
            <>
            {show && (
                <span
                style={{display: show}}
                className={`inline-block`}
                >
                &nbsp;
                </span>
            )}
            </>
        )
    }
    return (
        <>
        {show && (
            <span
            style={{display: show}}
            className={`inline-block`}
            >
            {char}
            </span>
        )}
        </>

    )
}
```

Let's break down the code. The meat of the logic is in the `useEffect` hook:
```jsx
function TypingChar({char, index, len, start, end, scroll}:
    {char: string, index:number, len: number, start:number, end:number, scroll: MotionValue<number>}) {
    const [show, setShow] = useState("none");
    useEffect(() => {
        const unsubscribe = scroll.on("change", 
        (latest) => {
            if (latest > index/len*(end-start)+start) {
                setShow("inline-block");
            }else{
                setShow("none");
            }
        })
        return () => {
            unsubscribe();
        }
    })
    ...
  }
  ```
The hook listens on the latest scroll values and determines whether the current character should be displayed. The logic is pretty simple, if the current scroll value is greater than the percentage of the character's index in the string multiplied by the range of the scroll value, then we show the character. Otherwise, we hide it. This way, the characters will be displayed one by one as we scroll down the page. 

A side effect of this mechanism is that *the more text there is, the faster the text will be displayed*. This is because the range of the scroll value is fixed, but the number of characters is not. This is something to keep in mind when designing the text.

Finally, the returned element wrapped in a `<span>` tag, and we use the `show` state to conditionally render it.
```
    if (char == " ") {
        return (
            <>
            {show && (
                <span
                style={{display: show}}
                className={`inline-block`}
                >
                &nbsp;
                </span>
            )}
            </>
        )
    }
    return (
        <>
        {show && (
            <span
            style={{display: show}}
            className={`inline-block`}
            >
            {char}
            </span>
        )}
        </>

    )
```

Then, to use this component with a string, we can create a wrapper component that maps over the string like this:
```jsx
export default function ScrollTypingText({
    text,
    start,
    end,
    scroll,
}:{text: string, 
    start: number,
    end: number,
    scroll: MotionValue<number>}) {
    
  return (
    <>
    {
        Array.from(text).map((char, index) => (
            <TypingChar 
            key={index}
            char={char}
            index={index}
            len={text.length}
            start={start}
            end={end}
            scroll={scroll}
            />
        ))
    }
    </>
  )
}
```

## Conclusion

And that's it! We have successfully created a scroll-typing effect using Framer-motion, Tailwind CSS, and Next.js. I hope you found this tutorial helpful, and if you have any questions, feel free to reach out to me on LinkedIn. I am always happy to help! 
