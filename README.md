# SCF API Client
A library that unifies interaction with SCF API.
## Versions
### 📦 Stable Versions
The `Stable` versions are released under the `latest` tag on npm.<br>
These versions are encouraged to be used in production with production API.

The version number reflects how inter-changeable the version is with other versions.<br>
They are named in a `x.y.z` style, where:
> `z` reflects the updates in the developer experience and the library itself.<br>
> **It is guaranteed that the versions that only differ in `z` are fully compatible feature-wise and interface-wise.**<br>
> They should only differ in the internal implementations and developer experience.

> `y` reflects the breaking changes in the API methods or the exposed interfaces.<br>
> **By default the versions that differ in `y` are unlikely to be compatible and you have to ensure that your code uses the updated interfaces correctly.**

> `x` is reserved for major breaking changes with the library or API implementations.<br>
> **Versions that differ in `x` are incompatible.**
### 🔧 Dev Versions
The `Dev` versions are released under the `dev` tag on npm.<br>
You are discouraged to use these versions as they are used for implementations of experimental features that could be breaking your code.<br>
Do NOT use dev versions in production setting.