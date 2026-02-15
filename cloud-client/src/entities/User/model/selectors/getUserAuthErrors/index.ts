import { StateSchema } from "@/app/providers/StoreProvider";

export const getUserAuthErrors = (state: StateSchema) => state.user.errors
