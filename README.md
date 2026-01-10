# Allow gnome-screenshot

GNOME 49 disallowed gnome-screenshot access to private screenshotting API: https://gitlab.gnome.org/GNOME/gnome-shell/-/merge_requests/3760

This extensions restores it in the allowlist.

Install from https://extensions.gnome.org/extension/9127/allow-gnome-screenshot/

Or manually install after cloning this repo with:

```
$ cp -r allow-gnome-screenshot@siddh.me ~/.local/share/gnome-shell/extensions/
```

---

Custom keyboard shortcuts for using gnome-screenshot:

```
[custom-keybindings/custom0]
binding='Print'
command='gnome-screenshot'
name='Instant screenshot'

[custom-keybindings/custom1]
binding='<Alt>Print'
command='gnome-screenshot -w'
name='Instant screenshot program window'

[custom-keybindings/custom2]
binding='<Shift>Print'
command='gnome-screenshot -a'
name='Instant screenshot area'

[custom-keybindings/custom3]
binding='<Control>Print'
command='sh -c "gnome-screenshot --file=/dev/shm/ss.png; xclip -selection clipboard -t image/png -i /dev/shm/ss.png; rm /dev/shm/ss.png"'
name='Instant copy screenshot'

[custom-keybindings/custom4]
binding='<Shift><Control>Print'
command='sh -c "gnome-screenshot -a --file=/dev/shm/ss.png; xclip -selection clipboard -t image/png -i /dev/shm/ss.png; rm /dev/shm/ss.png"'
name='Instant copy area screenshot'

[custom-keybindings/custom5]
binding='<Control><Alt>Print'
command='sh -c "gnome-screenshot -w --file=/dev/shm/ss.png; xclip -selection clipboard -t image/png -i /dev/shm/ss.png; rm /dev/shm/ss.png"'
name='Instant copy window screenshot'
```
