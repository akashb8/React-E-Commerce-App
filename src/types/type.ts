export interface ProductListType{
        id: number,
      title: string;
      description:string;
      category: string;
      price: number,
      discountPercentage: number,
      rating: number,
      brand:string;
      thumbnail:string,
}

export interface StoreDataType{
    products:ProductListType[];
    isLoading:boolean;
    isError:string | null;
    setProductsList:()=> void;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
}