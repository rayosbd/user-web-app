import {
  Avatar,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import ProductBox from "../../components/ProductBox";
import { categoryContext } from "../../context/categoryProvider";
import snackContext from "../../context/snackProvider";
import {
  useGetCategoryInfo,
  useGetSubCategoryInfo,
  useGetSubCategoryListByCategory,
  useInfiniteProductListByCategory,
  useInfiniteProductListBySubcategory,
} from "../../query/cat-subcat";
import {
  useGetBookmarkList,
  useInfiniteBookmarkList,
  useInfiniteSearch,
  useSearchProduct,
} from "../../query/product";
import { getAttachment } from "../../service/instance";
import ImageSlider from "../Home/ImageSlider";

const SearchResults = ({ search }) => {
  return (
    <Container
      sx={{
        py: 1,
      }}
    >
      {search ? (
        <>
          {search.type === "q" ? (
            <SearchProduct name={search.value} />
          ) : search.type === "category" ? (
            <CategoryProduct id={search.value} />
          ) : search.type === "subcategory" ? (
            <SubcategoryProduct id={search.value} />
          ) : search.type === "wishlist" ? (
            <WishListProduct />
          ) : search.type === "all" ? (
            <ALlProductLayout />
          ) : (
            <></>
          )}
        </>
      ) : (
        <SearchSkeleton />
      )}
    </Container>
  );
};

const WishListProduct = () => {
  const { createSnack } = React.useContext(snackContext);
  let [info, setInfo] = React.useState({});
  const { data, isLoading, isError, error } = useGetBookmarkList({ page: 1 });

  React.useEffect(() => {
    if (isLoading) return;
    setInfo(data ? data?.data : {});
    if (isError)
      if (error.response.status === 400)
        createSnack(error?.response.data.msg, "error");
      else createSnack("Something Went Wrong!", "error");
  }, [data]);

  const {
    isLoading: infIsLoading,
    isError: infIsError,
    error: infError,
    data: wishList,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetched,
    isFetchingNextPage,
  } = useInfiniteBookmarkList();

  React.useEffect(() => {
    console.log(hasNextPage);
    if (hasNextPage) fetchNextPage();
  }, [isFetched, hasNextPage, wishList]);

  return (
    <>
      <Typography
        variant={"h6"}
        sx={{
          textTransform: "capitalize",
        }}
      >
        {isLoading ? <Skeleton width={"120px"} /> : "Wishlist"}
      </Typography>
      <Typography variant={"caption"}>
        {isLoading ? (
          <Skeleton width={"220px"} />
        ) : (
          `${info?.total || 0} Results Found`
        )}
      </Typography>

      <Grid
        container
        direction={"row"}
        rowGap={0.6}
        columnGap={0.6}
        flexWrap={"wrap"}
        sx={{
          my: 2,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {wishList?.map((product) => (
          <Grid
            key={product._id}
            item
            xs={5.9}
            sm={3.85}
            md={2.92}
            lg={2.3}
            sx={{
              height: {
                xs: "280px",
                md: "310px",
              },
            }}
          >
            <ProductBox product={product.product} />
          </Grid>
        ))}
        {infIsLoading || isFetching || isFetchingNextPage ? (
          <>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <Skeleton
                key={num}
                variant="rectangular"
                component={Grid}
                item
                xs={5.9}
                sm={3.95}
                md={2.92}
                lg={1.97}
                sx={{
                  height: {
                    xs: "280px",
                    md: "310px",
                  },
                }}
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
};

const SearchProduct = ({ name }) => {
  const {
    isLoading: infIsLoading,
    data: productList,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetched,
  } = useInfiniteSearch({ search: name });

  React.useEffect(() => {
    if (hasNextPage) fetchNextPage();
  }, [isFetched, hasNextPage, productList]);

  return (
    <>
      <Typography
        variant={"h6"}
        sx={{
          textTransform: "capitalize",
        }}
      >
        {infIsLoading ? <Skeleton width={"120px"} /> : "Search : " + name}
      </Typography>
      <Typography variant={"caption"}>
        {infIsLoading ? (
          <Skeleton width={"220px"} />
        ) : (
          `${productList?.length} Results Found`
        )}
      </Typography>
      <Grid
        container
        direction={"row"}
        rowGap={0.6}
        columnGap={0.6}
        flexWrap={"wrap"}
        sx={{
          my: 2,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {productList?.map((product) => (
          <Grid
            key={product.id}
            item
            xs={5.9}
            sm={3.85}
            md={2.92}
            lg={2.3}
            sx={{
              height: {
                xs: "280px",
                md: "310px",
              },
            }}
          >
            <ProductBox product={product} />
          </Grid>
        ))}
        {infIsLoading || isFetching ? (
          <>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <Skeleton
                key={num}
                variant="rectangular"
                component={Grid}
                item
                xs={5.9}
                sm={3.95}
                md={2.92}
                lg={1.97}
                sx={{
                  height: {
                    xs: "280px",
                    md: "310px",
                  },
                }}
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
};

const CategoryProduct = ({ id }) => {
  const { createSnack } = React.useContext(snackContext);
  let [info, setInfo] = React.useState({});
  let [suggestionList, setSuggestionList] = React.useState([]);
  // let [productList, setProductList] = React.useState([]);
  const { data, isLoading, isError, error } = useGetCategoryInfo(id);

  React.useEffect(() => {
    if (isLoading) return;
    setInfo(data ? data?.data?.data : {});
    // setProductList(data ? data?.data?.data?.data : []);
    if (isError)
      if (error.response.status === 400)
        createSnack(error?.response.data.msg, "error");
      else createSnack("Something Went Wrong!", "error");
  }, [data]);
  // console.log(productList);

  const { data: sublistData } = useGetSubCategoryListByCategory(id);
  React.useEffect(() => {
    if (!sublistData) return;
    setSuggestionList(sublistData?.data?.data);
  }, [sublistData]);

  const {
    isLoading: infIsLoading,
    data: productList,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetched,
  } = useInfiniteProductListByCategory({ id });

  React.useEffect(() => {
    if (hasNextPage) fetchNextPage();
  }, [isFetched, hasNextPage, productList]);

  return (
    <>
      <ImageSlider homeImgList={info?.images || []} />
      <Stack direction={"row"} alignItems={"center"} columnGap={2}>
        {isLoading ? (
          <Skeleton variant={"rectangular"} height={"70px"} width={"70px"} />
        ) : (
          <Avatar
            variant={"rounded"}
            src={getAttachment(info?.icon?._id)}
          ></Avatar>
        )}
        <Stack direction={"column"}>
          <Typography
            variant={"h6"}
            sx={{
              textTransform: "capitalize",
              fontWeight: "600",
            }}
          >
            {isLoading ? (
              <Skeleton width={"120px"} />
            ) : (
              info?.titleEn || "Not Found"
            )}
          </Typography>
          <Typography variant={"caption"}>
            {isLoading ? (
              <Skeleton width={"220px"} />
            ) : (
              `${productList?.length || 0} Results Found`
            )}
          </Typography>
        </Stack>
      </Stack>
      {suggestionList?.length ? (
        <>
          <Stack
            direction={"row"}
            rowGap={1}
            columnGap={1}
            alignItems={"center"}
            flexWrap={"wrap"}
            sx={{
              pt: 1,
            }}
          >
            {suggestionList?.map((suggestion) => (
              <Chip
                label={suggestion.titleEn}
                key={suggestion._id}
                sx={{
                  borderRadius: "2px",
                  letterSpacing: "1px",
                }}
                clickable
                component={Link}
                to={`/search?subcategory=${suggestion._id}`}
              />
            ))}
          </Stack>
        </>
      ) : (
        <></>
      )}
      <Grid
        container
        direction={"row"}
        rowGap={0.6}
        columnGap={0.6}
        flexWrap={"wrap"}
        sx={{
          my: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <>
          {productList?.map((product) => (
            <Grid
              key={product.id}
              item
              xs={5.9}
              sm={3.85}
              md={2.92}
              lg={2.3}
              sx={{
                height: {
                  xs: "280px",
                  md: "310px",
                },
              }}
            >
              <ProductBox product={product} />
            </Grid>
          ))}
        </>
        {infIsLoading || isFetching ? (
          <>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <Skeleton
                key={num}
                variant="rectangular"
                component={Grid}
                item
                xs={5.9}
                sm={3.95}
                md={2.92}
                lg={1.97}
                sx={{
                  height: {
                    xs: "280px",
                    md: "310px",
                  },
                }}
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
};

const SubcategoryProduct = ({ id }) => {
  const { createSnack } = React.useContext(snackContext);
  let [info, setInfo] = React.useState({});
  let [suggestionList, setSuggestionList] = React.useState([]);
  const { data, isLoading, isError, error } = useGetSubCategoryInfo(id);

  React.useEffect(() => {
    if (isLoading) return;
    setInfo(data ? data?.data?.data : {});
    if (isError)
      if (error.response.status === 400)
        createSnack(error?.response.data.msg, "error");
      else createSnack("Something Went Wrong!", "error");
  }, [data]);

  const { data: sublistData } = useGetSubCategoryListByCategory(
    info?.category?._id
  );
  React.useEffect(() => {
    if (!sublistData) return;
    setSuggestionList(sublistData?.data?.data);
  }, [sublistData]);

  const {
    isLoading: infIsLoading,
    data: productList,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetched,
  } = useInfiniteProductListBySubcategory({ id });

  React.useEffect(() => {
    if (hasNextPage) fetchNextPage();
  }, [isFetched, hasNextPage, productList]);

  return (
    <>
      <Stack direction={"row"} alignItems={"center"} columnGap={2}>
        {isLoading ? (
          <Skeleton variant={"rectangular"} height={"70px"} width={"70px"} />
        ) : (
          <Avatar
            variant={"rounded"}
            src={getAttachment(info?.category?.icon)}
          ></Avatar>
        )}
        <Stack direction={"column"}>
          <Typography
            variant={"h6"}
            sx={{
              textTransform: "capitalize",
              fontWeight: "600",
            }}
          >
            {isLoading ? <Skeleton width={"120px"} /> : info?.titleEn || ""}
          </Typography>
          <Typography variant={"caption"}>
            {isLoading ? (
              <Skeleton width={"220px"} />
            ) : (
              `${productList?.length || 0} Results Found`
            )}
          </Typography>
        </Stack>
      </Stack>

      {suggestionList?.length ? (
        <>
          <Stack
            direction={"row"}
            rowGap={1}
            columnGap={1}
            alignItems={"center"}
            flexWrap={"wrap"}
            sx={{
              pt: 1,
            }}
          >
            {suggestionList?.map((suggestion) => (
              <Chip
                label={suggestion.titleEn}
                key={suggestion._id}
                sx={{
                  borderRadius: "2px",
                  letterSpacing: "1px",
                }}
                clickable
                component={Link}
                to={`/search?subcategory=${suggestion._id}`}
              />
            ))}
          </Stack>
        </>
      ) : (
        <></>
      )}

      <Grid
        container
        direction={"row"}
        rowGap={0.6}
        columnGap={0.6}
        flexWrap={"wrap"}
        sx={{
          my: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <>
          {productList?.map((product) => (
            <Grid
              key={product.id}
              item
              xs={5.9}
              sm={3.85}
              md={2.92}
              lg={2.3}
              sx={{
                height: {
                  xs: "280px",
                  md: "310px",
                },
              }}
            >
              <ProductBox product={product} />
            </Grid>
          ))}
        </>
        {infIsLoading || isFetching ? (
          <>
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <Skeleton
                key={num}
                variant="rectangular"
                component={Grid}
                item
                xs={5.9}
                sm={3.95}
                md={2.92}
                lg={1.97}
                sx={{
                  height: {
                    xs: "280px",
                    md: "310px",
                  },
                }}
              />
            ))}
          </>
        ) : (
          <></>
        )}
      </Grid>
    </>
  );
};

export const ALlProductLayout = () => {
  const { categoryList, isLoading } = React.useContext(categoryContext);

  let [productList, setProductList] = React.useState([]);

  React.useEffect(() => {
    if (isLoading) return;
    setProductList(categoryList);
  }, [categoryList]);

  // console.log(productList);

  return (
    <>
      {isLoading ? (
        <SearchSkeleton />
      ) : (
        <>
          {/* <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "primary.main",
              mb: 1,
              // pl: 1,
              pb: 1,
            }}
          >
            Products
          </Typography> */}

          {productList?.map((perCat, index) => (
            <React.Fragment key={perCat._id}>
              {perCat.products.length ? (
                <>
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    sx={{
                      my: 1,
                      bgcolor: "#efefef",
                      p: 1,
                      pl: 2,
                      borderRadius: "2px",
                    }}
                  >
                    <Typography
                      variant={"h6"}
                      sx={{
                        textTransform: "capitalize",
                        fontWeight: "600",
                        letterSpacing: "1px",
                      }}
                    >
                      {perCat.titleEn}
                    </Typography>
                    <Button
                      variant={"contained"}
                      size={"small"}
                      component={Link}
                      to={`/search?category=${perCat.id}`}
                    >
                      See More
                    </Button>
                  </Stack>
                  {/* <Divider /> */}
                  <Stack
                    direction={"row"}
                    rowGap={1}
                    columnGap={1}
                    alignItems={"center"}
                    flexWrap={"wrap"}
                    sx={{
                      my: 1,
                    }}
                  >
                    {perCat?.subcategories?.slice?.(0, 4)?.map((perSubCat) => (
                      <Chip
                        label={perSubCat.titleEn}
                        key={perSubCat._id}
                        sx={{
                          borderRadius: "2px",
                          letterSpacing: "1px",
                          fontWeight: '500'
                        }}
                        color={'secondary'}
                        clickable
                        component={Link}
                        to={`/search?subcategory=${perSubCat._id}`}
                      />
                    ))}
                  </Stack>
                  <Grid
                    container
                    direction={"row"}
                    rowGap={0.6}
                    columnGap={0.6}
                    flexWrap={"wrap"}
                    sx={{
                      my: 2,
                      alignItems: "center",
                      justifyContent: "flex-start",
                    }}
                  >
                    {perCat?.products?.map((product) => (
                      <Grid
                        key={product._id}
                        item
                        xs={5.9}
                        sm={3.85}
                        md={2.92}
                        lg={2.3}
                        sx={{
                          height: {
                            xs: "280px",
                            md: "310px",
                          },
                        }}
                      >
                        <ProductBox product={product} />
                      </Grid>
                    ))}
                  </Grid>
                  {/* {index !== productList.length - 1 && <Divider />} */}
                </>
              ) : (
                <></>
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );
};

const SearchSkeleton = () => {
  return (
    <>
      <Typography variant={"h4"}>
        <Skeleton width={"120px"} />
      </Typography>
      <Typography variant={"h5"}>
        <Skeleton width={"220px"} />
      </Typography>
      <Grid
        container
        direction={"row"}
        rowGap={0.4}
        columnGap={0.4}
        flexWrap={"wrap"}
        sx={{
          my: 1,
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7].map((num) => (
          <Skeleton
            key={num}
            variant="rectangular"
            component={Grid}
            item
            xs={5.9}
            sm={3.95}
            md={2.96}
            lg={1.97}
            sx={{
              height: {
                xs: "280px",
                md: "310px",
              },
            }}
          />
        ))}
      </Grid>
    </>
  );
};

export default SearchResults;
