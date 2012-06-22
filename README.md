## Mapness - compare sizes of places

When travelling I realized how bad my estimation of distances was in unknown places, so I created this tool one afternoon to help me compare a size of an unknown place or city to something I know. 

It turns out people are much better at relative comparisons than absolute comparisons. [Give it a try here](http://martinkonicek.net/mapness/#5,38.562477690029624,-99.28071712500002,46.42284931166597,8.342151000000078).

The comparison doesn't work well for places with too big latitude differences (e.g. [Greenland](http://martinkonicek.net/mapness/#4,74.74273048818017,-40.40703737499996,-27.868113418969166,134.56615162499995) vs. [Australia](http://en.wikipedia.org/wiki/File:Australia-Greenland_Overlay.png)). This is because Google maps are using Mercator projection that preserves angles (so that streets in Norway meet at right angles) but not areas.