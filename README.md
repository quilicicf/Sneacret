<!-- Formatted by https://github.com/quilicicf/markdown-formatter -->

# Sneacret

Sneak a secret message inside a string

## Purpose

Hide secrets inside innocent-looking strings.

## Example of usage

Hide the name of a platform inside your username. If you receive unsolicited email mentioning you by name, you might find out where the person found your info.

This will help you find who's leaking your personal information to spammers/hackers/recruiters...

## Inspirations

There are two modes of operation in sneacret.

### Zero width space

From [this post](https://medium.com/@umpox/be-careful-what-you-copy-invisibly-inserting-usernames-into-text-with-zero-width-characters-18b4e6f17b66).

The mode `zws` is a variation of the technique described in the post.

### Variation selectors

From [this post](https://paulbutler.org/2025/smuggling-arbitrary-data-through-an-emoji/).

The mode `vs` is a variation of the technique described in the post.

## Use it

### Install

```shell
deno install \
  --global \
  --no-prompt \
  --allow-read \
  --allow-env \
  --allow-exec=wl-copy \
  jsr:@quilicicf/sneacret
```

* Global installation to use it from anywhere
* No prompt to avoid being pestered by Deno's permission system
* Allow read & env because the CLI building tool (yargs) requires access to CWD & env variables
* Allow exec to allow sneacret to use your platform's clipboard tool to copy the results of your commands. See [clipboard.ts](./src/third-party/clipboard.ts) for more info.

### Hide a secret inside a string

To hide `secret` inside the string `Container`:

```shell
sneacret hide \
  --container 'Container' \
  --secret 'secret' \
  --to-clipboard
```

Arguments:

* `--mode (-m)`: the mode to use. `zws` or `vs` (default)
* `--container (-c)`: the string in which to hide the secret
* `--secret (-s)`: the secret to hide
* `--to-clipboard (-t)`: copies the result to the clipboard, see underlying OS tools in [clipboard.ts](./src/third-party/clipboard.ts)

### Reveal the secret hidden inside a string

To reveal the secret hidden inside `C‍᠎᠎⁠᠎‌‌﻿᠎⁠‍​ontainer`:

```shell
sneacret show \
  --mode "zws" \
  --container "C‍᠎᠎⁠᠎‌‌﻿᠎⁠‍​ontainer"
```

Arguments:

* `--mode (-m)`: the mode to use. `zws` or `vs` (default)
* `--container (-c)`: the string that contains the secret to reveal
* `--to-clipboard (-t)`: copies the result to the clipboard, see underlying OS tools in [clipboard.ts](./src/third-party/clipboard.ts)

### Show the supported alphabet

To show all the supported characters, use:

```shell
sneacret alphabet \
  --mode "zws"
```

Arguments:

* `--mode (-m)`: the mode to use. `zws` or `vs` (default)

### Example

```shell
stringWithSecret="$(sneacret hide -c Container -s Secret)"
# Displaying the result in the terminal might not work.
# Depending on the font, some invisible characters might get truncated.
# Pipe it to your clipboard or a file to avoid issues, the parameter --to-clipboard is there for this reason.
sneacret show -c "$stringWithSecret"
```

## How it works

### Zero width whitespace mode

There are 6 invisible characters that I identified, 5 of which seem to be supported correctly by most websites (see `SPACES_MAP` in [zws-encoder.ts](./src/domain/zws-encoder.ts)).

I could have encoded the `utf-8` character code of each character in my secret in binary like it's done in the article, but I figured I'd try to be more efficient.

For my use-case, being able to hide characters from the alphabet and a few punctuation marks is enough. This means that I have \~30 characters to encode.

Given the number of invisible characters I'm using, I can encode all my alphabet in just 3 slots because: `5^3 > 125`.

This means that if I create an alphabet where all letter are numbered from 0 to 25, I can express them in a base-6 number where `0 === String.fromCharCode(0x200B)`, `1 === String.fromCharCode(0x200C)` etc. for all my characters.

Concrete example:

```properties
Name=Quilici
Secret=github
SecretAsCharacterCodes=6,8,19,7,20,1
SecretAsCodeInBase6=10,12,31,11,32,01
SecretAsZwsCharacterCodes=0x200B,0x2060,0x200C,0x200B,0x2060,0x2060,0x200C,0x200B,0xFEFF,0x200B,0x2060,0x200D,0x200C,0x200C,0x200B,0x200B,0x200D,0x200C
EncodedSecret='Q᠎​᠎‌‍᠎᠎᠎‍‌​᠎uilici' # yes there are 12 invisible spaces there!
```

### Variation selector mode

This mode is fully straightforward. The number of characters in the variation selectors list is `256`. That's way more than what I need to encode simple information in the form `[a-zA-Z0-9-_.]+` which size is `26+26+10+3=65`.

This means I can allocate one variation selector for each character in my secret.

Concrete example :

```properties
Name=Quilici
Secret=LinkedIn
SecretAsCharacterCodes=47,18,23,20,14,13,44,23
SecretAsVsCharacterCodes=0xe011f,0xe0102,0xe0107,0xe0104,0xfe0e,0xfe0d,0xe011c,0xe0107
EncodedSecret=Q󠄟󠄂󠄇󠄄︎︍󠄜󠄇uilici # yes there are 8 variation selectors there!
```

## Gotchas

The characters may not visible, but they will still change some behaviors

* In some sites, if not supported by the font they'll show as squares
* In some sites they'll be swallowed for multiple possible reasons
* Because the invisible characters are still characters
  * The double click selects a word, it will select only the part that's not cut by invisible spaces (only in `zws` mode)
  * Your usual keyboard shortcut to select/move word by word will act the same, it'll get stuck on the invisible spaces
  * Moving the caret through the word will be a pain as it'll have to go through each character
* Wrapping may decide to cut your word in two
* Your name may exceed limits on the platform because the spaces count as characters of course
* If used in the service provided by the platform, it may cause horrible bugs
