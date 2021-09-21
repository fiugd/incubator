In short, I was not completely successful running an assembly in browser which was made to build other assemblies in the browser.

I was able to load a dll and run a command from it, but I was unable to get the compile to run using that dll.

my attempt: https://github.com/crosshj/fiug-plugins/blob/main/.templates/cs.html


About this, memory fails a little here, but here's what I recall...


I was using dotnet CLI and BlazorWasm template, but I also tried BasicDotNet template, and BlazorApp.

dotnet new blazorwasm
dotnet new blazorserver

What I was hoping for:
I wanted an assembly that I could hook into using javascript and not need to use the blazor bits.
Most tutorials (and maybe microsoft themselves) assume that blazor will be used to hook into the assembly.


This is the same with CompileBlazorInBlazor, but this does have the dotnet calls that need to be made to compile dotnet to assembly within the browser (at least).





https://www.mono-project.com/news/2017/08/09/hello-webassembly/

https://itnext.io/run-c-natively-in-the-browser-through-the-web-assembly-via-mono-wasm-60f3d55dd05a

https://www.rocksolidknowledge.com/articles/an-introduction-to-blazor-webassembly

https://github.com/BlazorComponents/CompileBlazorInBlazor

https://docs.microsoft.com/en-us/learn/modules/build-blazor-webassembly-visual-studio-code/

