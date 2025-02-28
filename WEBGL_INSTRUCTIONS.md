# WebGL Redesign Instructions

I've created several new files to redesign the site with WebGL:

1. WebGL Components:
   - `/src/components/WebGLBackground.tsx` - A WebGL background with particle effect
   - `/src/components/TokenModel.tsx` - Interactive 3D token model
   - `/src/components/SceneContainer.tsx` - Container for 3D scenes

2. Updated Pages:
   - `/src/pages/Home.new.tsx` - Home page with WebGL background and 3D models
   - `/src/pages/Product.new.tsx` - Product page with WebGL elements

## Installation Steps

1. First, install the necessary packages:
```bash
npm install three @react-three/fiber@8.15.19 @react-three/drei@9.122.0 --legacy-peer-deps
npm install --save-dev @types/three
```

2. Rename or copy the new files to replace the old ones:
```bash
mv src/pages/Home.new.tsx src/pages/Home.tsx
mv src/pages/Product.new.tsx src/pages/Product.tsx
```

## Additional Customization

Feel free to modify the WebGL effects:
- Adjust particle density and colors in `WebGLBackground.tsx`
- Change 3D models and materials in `TokenModel.tsx`
- Add more interactive elements to the scenes

## Note
This redesign maintains all the original content while adding immersive 3D elements that align with the "intention economy" theme of your product. The implementation uses:

- React Three Fiber for WebGL rendering
- Drei for helpful Three.js abstractions
- Instanced meshes for particle effects
- Physical materials for realistic rendering
- Interactive 3D elements that respond to user input
