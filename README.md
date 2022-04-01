<!-- This READM is based on the BEST-README-Template (https://github.com/othneildrew/Best-README-Template) -->
<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Downloads][downloads-shield]][npm-url]
[![Version][npm-version-shield]][npm-url]
[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Apache 2.0 license][license-shield]][license-url]
[![Discord][discord-shield]][discord-url]
[![StackExchange][stackexchange-shield]][stackexchange-url]
<!-- Add additional Badges. Some examples >
![Format Badge](https://github.com/iotaledger/template/workflows/Format/badge.svg "Format Badge")
![Audit Badge](https://github.com/iotaledger/template/workflows/Audit/badge.svg "Audit Badge")
![Clippy Badge](https://github.com/iotaledger/template/workflows/Clippy/badge.svg "Clippy Badge")
![BuildBadge](https://github.com/iotaledger/template/workflows/Build/badge.svg "Build Badge")
![Test Badge](https://github.com/iotaledger/template/workflows/Test/badge.svg "Test Badge")
![Coverage Badge](https://coveralls.io/repos/github/iotaledger/template/badge.svg "Coverage Badge")


<!-- PROJECT LOGO -->
<br />
<div align="center">
    <a href="https://github.com/iotaledger/template">
        <img src="is_banner.png" alt="Banner">
    </a>
    <h3 align="center">IS-CLI</h3>
    <p align="center">
        The Command Line Interface for the Integration Services. Setup the IS-API, manage Identities and Channels with ease.
        <br />
        <a href="https://wiki.iota.org"><strong>Explore the docs »</strong></a>
        <br />
        <br />
        <a href="https://github.com/iota-community/iscli/labels/bug">Report Bug</a>
        ·
        <a href="https://github.com/iota-community/iscli/labels/enhancement">Request Feature</a>
    </p>
</div>



<!-- TABLE OF CONTENTS -->
<!-- TODO 
Edit the ToC to your needs. If your project is part of the wiki, you should link directly to the Wiki where possible and remove unneeded sections to prevent duplicates 
-->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

This is the IS-CLI for easy interaction with the [IOTA Integration Services](https://github.com/iotaledger/integration-services). Create and manage Identities, Verifiable Credentials, Channels via command line.

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

* [IOTA IS-Client](https://www.npmjs.com/package/@iota/is-client)
* [commander](https://www.npmjs.com/package/commander)
* [nconf](https://www.npmjs.com/package/nconf)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

-   min. Node v15.6.0

### Installation

```sh
npm install -g @iota/is-cli@latest
```

or for one-time use

```sh
npx @iota/is-cli <command>
```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

-   For local API access run: `is config -s http://localhost:3001 -a http://localhost:3002 -k <your-api-key>`.
-   Configure API environment: `is setup-node`.
-   For most of the channel and identity commands is a `identity.json` in the directory where the cli is executed needed.
-   View all command with `is help`.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [x] IS API setup script
- [ ] Add all IS-Client commands to the cli


See the [open issues](https://github.com/iota-community/iscli/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the Apache License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Tim Sigl - [@Schereo](https://twitter.com/schereo) - tim.sigl@iota.org <br>
Juri Bogatyrjow - juri.bogatyrjow@iota.org

Project Link: [https://github.com/iotaledger/template](https://github.com/iotaledger/template)

<p align="right">(<a href="#top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/iotaledger/template.svg?style=for-the-badge
[contributors-url]: https://github.com/iotaledger/template/graphs/contributors
[npm-url]: https://www.npmjs.com/package/@iota/is-client
[downloads-shield]: https://img.shields.io/npm/dw/@iota/is-cli?style=for-the-badge
[npm-version-shield]: https://img.shields.io/npm/v/@iota/is-cli?style=for-the-badge
[stars-shield]: https://img.shields.io/github/stars/iotaledger/template.svg?style=for-the-badge
[stars-url]: https://github.com/iota-community/iscli/stargazers
[issues-shield]: https://img.shields.io/github/issues/iotaledger/template.svg?style=for-the-badge
[issues-url]: https://github.com/iotaledger/template/issues
[license-shield]: https://img.shields.io/github/license/iotaledger/template.svg?style=for-the-badge
[license-url]: https://github.com/iota-community/iscli/blob/main/LICENSE
[discord-shield]: https://img.shields.io/badge/Discord-9cf.svg?style=for-the-badge&logo=discord
[discord-url]: https://discord.com/channels/397872799483428865/910192737842790400
[stackexchange-shield]: https://img.shields.io/badge/StackExchange-9cf.svg?style=for-the-badge&logo=stackexchange
[stackexchange-url]: https://iota.stackexchange.com
