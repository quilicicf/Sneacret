# HiddenString

Hide a string inside another

## Why tho?

Have you never received an email from a stranger that seemed to know lots of things about you and wanted to recruit you (or sell something)?

Have you ever wanted to know where the hell that guy found your email address?

It's possible and easy with hidden strings. It consists in encoding the name of a platform as invisible characters in your name on the said platform.

When the sender's crawler retrieves your name, the location from which they got your email will be hidden in the message all along and you'll know what to think of the content of the message.

The applications may vary, knowing that a platform leaks your data, how a recruiter found you...

## Inspiration

I already did something similar by hiding invisible spaces (U+FEFF) in a recognizable pattern. The drawback was that I had to store a dictionary of patterns against website.

Reading this [post](https://medium.com/@umpox/be-careful-what-you-copy-invisibly-inserting-usernames-into-text-with-zero-width-characters-18b4e6f17b66), I realized that there were actually several invisible characters. The implication is that one can encode any message in a series of invisible characters.

This repository is a variation of the technique described above.

## How it works

There are 6 invisible characters that I identified (see in src/utils.js). I could have encoded the utf-8 character code of each character in my secret in binary like it's done in the article but I figured I'd try to be more efficient.

For my use-case, being able to hide only characters from the alphabet is enough. This means that I have 26 characters to encode.

Given the number of invisible characters I found, I can encode all in just 2 slots because: `6^2 > 26`.

This means that if I create an alphabet where all letter are numbered from 0 to 25, I can express them in a base-6 number where `0 === String.fromCharCode(0x200B)`, `1 === String.fromCharCode(0x200C)` etc for all my characters.

Concrete example:
```
Name=Quilici
Secret=github
SecretAsCharacterCodes=6,8,19,7,20,1
SecretAsCodeInBase6=10,12,31,11,32,01
SecretAsSpaces='Q᠎​᠎‌‍᠎᠎᠎‍‌​᠎uilici' <- yes there are 12 invisible spaces there!
```

Paste the result in dillinger.io if you don't trust it.

## Gotchas

- The spaces may not visible but they will still change some behaviors
  - In some sites, if not supported by the font they'll show as squares
  - In some sites they just won't show for multiple possible reasons
  - The double click selects a word. Here it will select only the part that's not cut by the spaces
  - Wrapping may decide to cut your word in two
  - Your name may exceed limits on the platform because the spaces count as characters of course
  - If used in the service provided by the platform, it may break their code
