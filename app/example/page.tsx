import React from 'react'
import BlurRevealText from './_components/TextEffect'
import PixelFadeSection from './_components/PixedFadeSection'
import FocusScrollText from './_components/FocusScrollText'

export default function page() {
    return (
        <div>
            <PixelFadeSection />
            <BlurRevealText text='This is the text' />
            <FocusScrollText
  text="Design is not just what it looks like and feels like design is how it works. Great experiences emerge when motion typography visuals and interaction combine into one seamless storytelling system that guides the user naturally through the interface while keeping attention focused exactly where it should be."
/>
        </div>
    )
}
