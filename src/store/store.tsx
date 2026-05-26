import {create} from "zustand";
import type { StoreDataType } from "../types/type";
import { getProductList } from "../api/apicall";
export const useStore = create<StoreDataType>((set)=>({
    products:[],
    isLoading:false,
    isError:"",
    searchQuery: "",
    setSearchQuery: (query: string) => set(() => ({ searchQuery: query })),
    setProductsList:async()=> {
        set(()=> ({isLoading:true}));
        try {
            const dataResponse = await getProductList();
            set(()=> ({products: dataResponse}));
        } catch (error) {
            if(error instanceof Error){
                set(()=> ({isLoading:false,isError:error?.message || "Something went wrong!"}));
            }
        }finally{
            set(()=> ({isLoading:false}));
        }
    },
}))