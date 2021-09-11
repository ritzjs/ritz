import {useQuery} from "ritz"
import getCurrentUser from "app/users/queries/getCurrentUser"

export const useCurrentUser = () => {
  const [user] = useQuery(getCurrentUser, null)
  return user
}
