import { Box, Flex, Textarea, type TextareaProps } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";
import { Icon } from "@chakra-ui/icons";
import { MdRemove, MdUpload, MdImage } from "react-icons/md";
import { CustomImage } from "./image";

interface AddImageProps {
  id?: number;
  handleImageChange?: (props: ImageListType) => void;
}

export function AddImage({ handleImageChange }: AddImageProps) {
  const [images, setImages] = useState<ImageListType>([]);
  const maxNumber = 69;

  useEffect(() => {
    // TODO: if id is present directly upload and store the image
    // else hand it over to the parent
    handleImageChange && handleImageChange(images);
  }, [images]);

  const onChange = (
    imageList: ImageListType,
    addUpdateIndex: number[] | undefined
  ) => {
    // data for submit
    setImages(imageList);
  };

  return (
    <ImageUploading
      multiple
      value={images}
      onChange={onChange}
      maxNumber={maxNumber}
    >
      {({
        imageList,
        onImageUpload,
        onImageRemoveAll,
        onImageUpdate,
        onImageRemove,
        isDragging,
        dragProps,
      }) => (
        // write your building UI
        <>
          {imageList.map((image, index) => (
            <Box key={index} mb={12} pos="relative">
              <Box pos="relative" minH={120}>
                {/* @ts-ignore:next-line */}
                <CustomImage src={image.dataURL as string} alt="" fill />
              </Box>
              <Textarea
                id={image?.file?.name}
                width="100%"
                placeholder="Image caption here"
                onChange={(e: any) => {
                  const current = e.currentTarget;
                  const newImagesArr: any = images.map((obj) => {
                    if (obj?.file?.name === current.id) {
                      return Object.assign(obj, { caption: current.value });
                    }

                    return obj;
                  });

                  setImages(newImagesArr);
                }}
              />
              <Flex
                gap={4}
                pos="absolute"
                top={0}
                right={0}
                color="white"
                fontSize={9}
                p={4}
              >
                {/* <button onClick={() => onImageUpdate(index)}>Update</button> */}
                <button onClick={() => onImageRemove(index)}>
                  <Icon as={MdRemove} />
                </button>
              </Flex>
            </Box>
          ))}
          <div>
            <Box bgColor="#f1f1f1" p={6} textAlign="center">
              <button
                style={isDragging ? { color: "red" } : undefined}
                onClick={onImageUpload}
                {...dragProps}
              >
                <Icon as={MdImage} />
                <Icon as={MdUpload} />
              </button>
              {/* &nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button> */}
            </Box>
          </div>
        </>
      )}
    </ImageUploading>
  );
}
