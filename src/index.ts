import { copyImages, copyModuleJson, copyPacks, makeLibDir } from './copy';

makeLibDir();
copyModuleJson();
copyImages();
copyPacks();
