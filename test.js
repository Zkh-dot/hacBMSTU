const obj1  = {
   "name": "Todd",
    "age": true    
  };
   
  const obj2 = {
    "languages": ["Spanish", "Portuguese"],
    "age": "e2gr3kelkb"
  };
   
   
  const mergedObject = {
    ...obj1,
    ...obj2
  };

console.log(mergedObject)
