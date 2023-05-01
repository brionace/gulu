import React, { useEffect, useState } from "react";
import { AddImage } from "./add-image";
import { useForm, FieldValues, Controller } from "react-hook-form";
import { Box, Flex, Textarea } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { MdClose, MdRemove } from "react-icons/md";
import { InputWrapper, Label, Input } from "./form";
import { useUser } from "@clerk/nextjs";
import { CustomImage } from "./image";

interface Post {
  title: string;
  excerpt: string;
  content: string;
  published: boolean;
}

export interface ImageProps {
  id: number;
  name: string;
  caption: string;
}

type PostProps = Post & { images: ImageProps[] };

// type AddPostProps = Post & { id: number; updatedAt: string };

interface AddPostProps {
  id?: number;
}

export function AddPost({ id }: AddPostProps) {
  const { user } = useUser();
  const [post, setPost] = useState<PostProps | null>(null);
  const [draft, setDraft] = useState<boolean>(false);
  const [newImages, setNewImages] = useState<unknown[]>();
  const postImages = post?.images;

  useEffect(() => {
    setDraft(
      post?.published === undefined || post?.published === false ? true : false
    );
  }, [post]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      if (!id) {
        return;
      }
      const res = await fetch(`/api/post/get?id=${id}`);
      const post: PostProps = await res.json();

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      setPost(post);

      return {
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        published: post.published,
      };
    },
  });

  async function onFormSubmit(data: FieldValues) {
    Object.assign(data, {
      published: draft,
      categories: {},
      tags: [],
      images: newImages,
      author: user?.id,
      authorEmail: user?.primaryEmailAddress?.emailAddress,
    });

    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        body: JSON.stringify({ data }),
      });

      if (res.status !== 200) {
        // TODO: handle error
        return null;
      }

      window.location.href = "/admin";
    } catch (err) {
      console.log(err);
    }
  }

  async function onFormUpdate(data: FieldValues) {
    Object.assign(data, {
      published: draft,
      id,
    });
    try {
      const res = await fetch("/api/post/update", {
        method: "POST",
        body: JSON.stringify({
          type: "POST",
          data,
          postImages,
          newImages,
        }),
      });

      if (res.status !== 200) {
        // TODO: handle error
        return null;
      }

      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  async function deleteWork() {
    try {
      const res = await fetch("/api/post/delete-post", {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      if (res.status !== 200) {
        // TODO: handle error
        return null;
      }

      window.location.href = "/admin";
    } catch (err) {
      console.log(err);
    }
  }

  function removeWork(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) {
    e.preventDefault();
    window.confirm("Confirm delete") && deleteWork();
  }

  return (
    <>
      <Flex alignItems="flex-start">
        <Box
          as="a"
          href="/admin"
          mb={8}
          bgColor="#f1f1f1"
          p={8}
          pos="sticky"
          top={0}
        >
          <Icon as={MdClose} />
        </Box>
        <Box flex={1}>
          <form
            id="form"
            onSubmit={handleSubmit((data) =>
              id ? onFormUpdate(data) : onFormSubmit(data)
            )}
          >
            <InputWrapper>
              <Label label="Title" />
              <Controller
                control={control}
                name="title"
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    onChange={onChange}
                    // onBlur={onBlur}
                    value={value}
                    placeholder="Enter the title..."
                    minHeight="5vh"
                  />
                )}
              />
              {/* <Box
                {...register("title", {
                  required: "Title cannot be empty",
                })}
                onInput={(e) => {
                  if (e.currentTarget.textContent) {
                    setValue("title", e.currentTarget.textContent, {
                      shouldDirty: true,
                    });
                  }
                }}
                minH="5vh"
                contentEditable={true}
                suppressContentEditableWarning={true}
                placeholder="Enter the title..."
              >
                {getValues("title")}
              </Box> */}
              {errors.title && <p>The title is required.</p>}
            </InputWrapper>
            <InputWrapper>
              <Label label="Excerpt" />
              <Controller
                control={control}
                name="excerpt"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder="Enter the excerpt..."
                    minHeight="5vh"
                  />
                )}
              />
            </InputWrapper>
            <InputWrapper>
              <Label label="Content" />
              <Controller
                control={control}
                name="content"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder="Enter the content..."
                    minHeight="5vh"
                  />
                )}
              />
              {errors.content && <p>The content is required.</p>}
            </InputWrapper>
          </form>
          <Flex gap={8} my={8} flexWrap="wrap">
            {postImages &&
              postImages.map((image: ImageProps) => {
                const imageId = image.id;
                return (
                  <UploadedImage
                    key={imageId}
                    postId={id}
                    image={image}
                    updateCaption={(caption: string) => {
                      const newPost = post;
                      const newImages = newPost.images.map((image) => {
                        if (image.id === imageId) {
                          image.caption = caption;
                        }
                        return image;
                      });
                      Object.assign(newPost, { images: newImages });
                      setPost(newPost);
                    }}
                  />
                );
              })}
            <AddImage
              id={id}
              handleImageChange={(images: any) => setNewImages(images)}
            />
          </Flex>
        </Box>
        <Flex flexDirection="column" pos="sticky" top={0}>
          <Box
            as="button"
            type="submit"
            form="form"
            p={8}
            bgColor="ButtonHighlight"
          >
            {id ? "Update" : "Publish"}
          </Box>
          <Box as="label" p={8} bgColor="#ccc">
            <div>Draft</div>
            <input
              type={"checkbox"}
              onChange={() => setDraft(!draft)}
              checked={draft}
            />
          </Box>
          {id ? (
            /* @ts-ignore:next-line */
            <Box as="a" onClick={removeWork} cursor="pointer" m={8}>
              Delete
            </Box>
          ) : null}
        </Flex>
      </Flex>
    </>
  );
}

type UploadedImageProps = {
  postId: number | undefined;
  image: ImageProps;
  updateCaption: (caption: string) => void;
};

function UploadedImage({ postId, image, updateCaption }: UploadedImageProps) {
  const imageId = image.id;
  const imageName = image.name;
  const imageCaption = image.caption;

  function handleOnchange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    updateCaption(e.currentTarget.value);
  }

  async function deleteImage() {
    try {
      const res = await fetch("/api/post/delete-image", {
        method: "POST",
        body: JSON.stringify({
          imageId: imageId,
          postId: postId,
          imageName: imageName,
        }),
      });

      if (res.status !== 200) {
        // TODO: handle error
        return null;
      }

      document.getElementById(`${imageId}`)?.remove();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Box id={`${imageId}`} pos="relative" mb={12}>
      <Box pos="relative" minH={120}>
        {/* @ts-ignore:next-line */}
        <CustomImage src={`/uploads/posts/${imageName}`} alt="" fill />
      </Box>
      <Textarea
        p={9}
        width="100%"
        defaultValue={imageCaption}
        onChange={handleOnchange}
        placeholder="Image caption here"
      />
      <Box
        as="button"
        pos="absolute"
        top={0}
        right={0}
        color="white"
        fontSize={9}
        p={4}
        onClick={() => window.confirm("Confirm delete") && deleteImage()}
      >
        <Icon as={MdRemove} />
      </Box>
    </Box>
  );
}
