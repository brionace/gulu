import React, { useEffect, useState } from "react";
import { AddImage } from "./add-image";
import { useForm, FieldValues, Controller } from "react-hook-form";
import { Box, Flex, Textarea } from "@chakra-ui/react";
import { Icon } from "@chakra-ui/icons";
import { MdClose, MdRemove } from "react-icons/md";
import { Input, InputWrapper, Label } from "./form";
import { CustomImage } from "./image";

interface Page {
  name: string;
  slug: string;
  description: string;
  content: string;
  published: boolean;
  showInNav: boolean;
}

export interface ImageProps {
  id: number;
  name: string;
  caption: string;
}

type PageProps = Page & { images: ImageProps[] };

interface AddPageProps {
  id?: number;
}

export function AddPage({ id }: AddPageProps) {
  const [page, setPage] = useState<PageProps | null>(null);
  const [draft, setDraft] = useState<boolean>(false);
  const [showInNav, setShowInNav] = useState<boolean>(false);
  const [newImages, setNewImages] = useState<unknown[]>();
  const pageImages = page?.images;

  useEffect(() => {
    setDraft(
      page?.published === undefined || page?.published === false ? true : false
    );
    setShowInNav(page?.showInNav === undefined ? false : page?.showInNav);
  }, [page]);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      if (!id) {
        return;
      }
      const res = await fetch(`/api/page/get?id=${id}`);
      const page: PageProps = await res.json();

      if (!res.ok) {
        throw new Error(res.statusText);
      }

      setPage(page);

      return {
        name: page.name,
        slug: page.slug,
        description: page.description,
        content: page.content,
        published: page.published,
        showInNav: page.showInNav,
      };
    },
  });

  async function onFormSubmit(data: FieldValues) {
    Object.assign(data, {
      published: draft,
      showInNav,
      navPosition: 1,
      images: newImages,
      slug: data.name.replace(" ", "-").toLowerCase(),
    });

    try {
      const res = await fetch("/api/page/create", {
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
      showInNav,
      slug: data.slug.replace(" ", "-").toLowerCase(),
    });
    try {
      const res = await fetch("/api/page/update", {
        method: "POST",
        body: JSON.stringify({
          type: "POST",
          data,
          pageImages,
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

  async function deletePage() {
    try {
      const res = await fetch("/api/page/delete-page", {
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
    window.confirm("Confirm delete") && deletePage();
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
              <Label label="Name" />
              <Controller
                control={control}
                name="name"
                rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <Input
                    onChange={onChange}
                    value={value}
                    placeholder="Enter the name..."
                    minHeight="5vh"
                  />
                )}
              />
              {errors.name && <p>Name is required.</p>}
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
            <Box border={"1px solid"} p={4}>
              <InputWrapper>
                <label>SEO</label>
              </InputWrapper>
              <InputWrapper>
                <Label label="Description" />
                <Controller
                  control={control}
                  name="description"
                  rules={{ required: true }}
                  render={({ field: { onChange, value } }) => (
                    <Input
                      onChange={onChange}
                      value={value}
                      placeholder="Enter the description..."
                      minHeight="5vh"
                    />
                  )}
                />
              </InputWrapper>
              {page?.slug && (
                <InputWrapper>
                  <Label label="Slug" />
                  <Controller
                    control={control}
                    name="slug"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <Input
                        onChange={onChange}
                        value={value}
                        placeholder="Enter the slug..."
                        minHeight="5vh"
                      />
                    )}
                  />
                </InputWrapper>
              )}
            </Box>
          </form>
          <Flex gap={8} my={8} flexWrap="wrap">
            {pageImages &&
              pageImages.map((image: ImageProps) => {
                const imageId = image.id;
                return (
                  <UploadedImage
                    key={imageId}
                    pageId={id}
                    image={image}
                    updateCaption={(caption: string) => {
                      const newPage = page;
                      const newImages = newPage.images.map((image) => {
                        if (image.id === imageId) {
                          image.caption = caption;
                        }
                        return image;
                      });
                      Object.assign(newPage, { images: newImages });
                      setPage(newPage);
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
              onChange={() => setDraft(draft ? false : true)}
              checked={draft}
            />
          </Box>
          <Box as="label" p={8} bgColor="#c1c1c1">
            <div>Show In Nav</div>
            <input
              type={"checkbox"}
              onChange={() => setShowInNav(showInNav ? false : true)}
              checked={showInNav}
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
  pageId: number | undefined;
  image: ImageProps;
  updateCaption: (caption: string) => void;
};

function UploadedImage({ pageId, image, updateCaption }: UploadedImageProps) {
  const imageId = image.id;
  const imageName = image.name;
  const imageCaption = image.caption;

  function handleOnchange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    updateCaption(e.currentTarget.value);
  }

  async function deleteImage() {
    try {
      const res = await fetch("/api/page/delete-image", {
        method: "POST",
        body: JSON.stringify({
          imageId: imageId,
          pageId: pageId,
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
        <CustomImage src={`/uploads/pages/${imageName}`} alt="" fill />
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
