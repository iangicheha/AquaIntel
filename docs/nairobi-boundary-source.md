# Nairobi County boundary source

The user supplied `/home/ubuntu/upload/kenya_counties.zip`, containing the shapefile `kenya_counties/kenya_counties.shp` plus DBF, SHX, PRJ, CPG, and QMD files.

Inspection found the feature with `COUNTY=Nairobi` at record index 40, with source bbox `xmin=36.65987014728961, ymin=-1.444060206013546, xmax=37.10451507571037, ymax=-1.160105347583567`, one geometry part, and 1,490 source points.

The dashboard uses a simplified 128-point SVG path generated from that verified feature in `client/src/lib/nairobiBoundary.ts`. The old illustrative subdivision lines were removed; the interactive hydraulic topology remains layered above the verified county boundary.
