<h1 align="center">
	<br>
	<img width="500" src="https://github.com/nuriu/ajanda/blob/develop/wwwroot/logo.png" alt="Ajanda">
	<br>
	<br>
</h1>

>Geliştiriciler için yardımcı ajanda. (Assistant agenda for the developers.)

[![Project Status: WIP - Initial development is in progress, but there has not yet been a stable, usable release suitable for the public.](http://www.repostatus.org/badges/latest/wip.svg)](http://www.repostatus.org/#wip)
[![Build status](https://ci.appveyor.com/api/projects/status/ycvxorpuvelji2kn?svg=true)](https://ci.appveyor.com/project/nuriu/ajanda-o0i0c)
[![Build status](https://api.travis-ci.org/nuriu/ajanda.svg)](https://travis-ci.org/nuriu/ajanda)
[![Dependency Status](https://david-dm.org/nuriu/ajanda/status.svg)](https://david-dm.org/nuriu/ajanda)
[![Dev-Dependency Status](https://david-dm.org/nuriu/ajanda/dev-status.svg)](https://david-dm.org/nuriu/ajanda?type=dev)


**Kullanılan Teknolojiler (Used Technologies);**

- NodeJS
- Webpack
- Electron
- TypeScript
- codelyzer
- jQuery
- rxjs
- zone.js
- Angular 2
- Semantic UI
- GitHub API
- Typedoc

### Derleme (Compiling)

**TR** Proje dizinine, aşağıdaki bilgileri içeren *keys.json* isimli bir dosya oluşturun;

**EN** Create a file named *keys.json* in the repo dir and insert these;

```json
{
    "github": {
        "client_id": "your github username for authentication",
        "secret_key": "your github password for authentication"
    }
}

```

**TR**: Bu işlemi gerçekleştirdikten sonra aşağıdaki kod ile gereksinimleri kurabilirsiniz;

**EN**: Then install dependencies with;

> npm run setup

**TR**: Geriye kalan tek şey projeyi derleyip çalıştırmak;

**EN**: Now you can compile and run with;

> npm run build


### Documentation

You can check it out @ http://nuriuzunoglu.com/ajanda/


*Secret book Icon Artist:* **ArtDesigner.lv**
