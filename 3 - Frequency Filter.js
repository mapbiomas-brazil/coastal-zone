/**** Start of imports. If edited, may not auto-convert in the playground. ****/
var geometry = 
    /* color: #d63000 */
    /* shown: false */
    ee.Geometry.Polygon(
        [[[-51.38391626123581, -33.391337195941865],
          [-46.46204126123581, -26.938005669802514],
          [-44.00110376123581, -24.563380678023695],
          [-38.81555688623581, -24.082847424496894],
          [-38.02454126123581, -22.711609231683166],
          [-37.32141626123581, -18.933587581142103],
          [-37.05774438623581, -17.01084824036864],
          [-36.61829126123581, -12.593454493009688],
          [-33.98157251123581, -11.045015643867439],
          [-33.89368188623581, -6.267543928374215],
          [-34.59680688623581, -4.17113700534739],
          [-37.05774438623581, -1.6257799594279219],
          [-46.81360376123581, 0.5712579899933413],
          [-50.06555688623581, 6.184224679310395],
          [-52.96594751123581, 3.2063114131906647],
          [-51.91126001123581, -1.450062098154477],
          [-47.69251001123581, -4.346432820903858],
          [-39.60657251123581, -5.834637661383505],
          [-39.34290063623581, -9.855835411252327],
          [-40.92493188623581, -13.641259522308992],
          [-43.91321313623581, -20.52537744777431],
          [-48.74719751123581, -23.378133147844657],
          [-49.80188501123581, -25.61710452521008],
          [-49.62610376123581, -28.04807733281191],
          [-50.75953307496976, -29.327453577983007],
          [-53.39625182496976, -31.82422844171591],
          [-54.45093932496976, -33.37903044073654],
          [-52.64918151246976, -34.25526752251144]]]);
/***** End of imports. If edited, may not auto-convert in the playground. *****/
/**
 * @Author Luiz Cortinhas
 * @Version 1
 * @Note this function aims load the temporal filtered images into a single image collection
 * @Return ee.ImageCollection
**/
var getImageCollection = function(){
  var images = ee.List([]);
  for(var i = 1985; i < 2020; i++){
    images = images.add(ee.Image('projects/mapbiomas-workspace/TRANSVERSAIS/ZONACOSTEIRA5/ft_'+i))
  }
  return ee.ImageCollection(images)
}
/**
 * @Author Luiz Cortinhas
 * @Version 1
 * @Note this function aims apply the desired frequency filter to binarized image collection,
 * @Return ee.ImageCollection
**/
var filterPixelFrequency = function(imc,cutPercentage,classID){
  var imcFreq = imc.map(function(e){ return e.eq(classID)}).sum().divide(34).multiply(100); //Frequency Image
  var filteredImages= ee.List([]);
  Map.addLayer(imcFreq,{min:0,max:100,palette:['fff9f9','ff0000','efff00','27ff00','ef00ff']},'Freq -'+classID)
  for(var i = 1985; i < 2020; i++){
    var image = ee.Image('projects/mapbiomas-workspace/TRANSVERSAIS/ZONACOSTEIRA5/ft_'+i);
    image = image.updateMask(image.eq(classID)).where(imcFreq.lte(cutPercentage),0); // MAGIC! happening here
    filteredImages = filteredImages.add(image)
  }
  return filteredImages
}
// MAIN CODE STARTS HERE!
var imc = getImageCollection()
//print(imc)
//B&D
var bed = filterPixelFrequency(imc,20,23)
var bed_2019 = ee.ImageCollection(bed).filterMetadata('year','equals',2019).mosaic().unmask(0)
var bed_2018 = ee.ImageCollection(bed).filterMetadata('year','equals',2018).mosaic().unmask(0)
//Apicum
var apicum = filterPixelFrequency(imc,20,32)
var apicum_2019 = ee.ImageCollection(apicum).filterMetadata('year','equals',2019).mosaic().unmask(0)
var apicum_2018 = ee.ImageCollection(apicum).filterMetadata('year','equals',2018).mosaic().unmask(0)
// Mangrove
var mangrove = filterPixelFrequency(imc,20,5)
var mangrove_2019 = ee.ImageCollection(mangrove).filterMetadata('year','equals',2019).mosaic().unmask(0)
var mangrove_2018 = ee.ImageCollection(mangrove).filterMetadata('year','equals',2018).mosaic().unmask(0)
var union2019 = ee.ImageCollection([mangrove_2019,apicum_2019,bed_2019]).max()
var union2018 = ee.ImageCollection([mangrove_2018,apicum_2018,bed_2018]).max()
Map.addLayer(union2019,{min:0,max:32},'2019 - Filtered')
Map.addLayer(union2018,{min:0,max:32},'2018 - Filtered')
Export.image.toAsset({
      image: union2019.rename('classification').toByte().set({'classification':'1','year':2019,'version':'5','region':'Brasil'}).toByte(),
      description:'Mapbiomas5_ff_' + 2019,
      assetId: 'projects/mapbiomas-workspace/TRANSVERSAIS/ZONACOSTEIRA5/ff_'+2019+'',
      scale: 30,
      maxPixels:1e13,
      region: geometry
    });
    
    Export.image.toAsset({
      image: union2018.rename('classification').toByte().set({'classification':'1','year':2018,'version':'5','region':'Brasil'}).toByte(),
      description:'Mapbiomas5_ff_' + 2018,
      assetId: 'projects/mapbiomas-workspace/TRANSVERSAIS/ZONACOSTEIRA5/ff_'+2018+'',
      scale: 30,
      maxPixels:1e13,
      region: geometry
    });