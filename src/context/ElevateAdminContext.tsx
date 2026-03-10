"use client"

import { Company, getCompanies } from "@/serverActions/crudCompanies";
import { getUsers, User } from "@/serverActions/crudUsers";
import { createContext, useContext, useEffect, useState } from "react";
type ElevateAdminContextProps = {
    users: User[] | [];
    companies: CompaniesWithMemberCount[] | [];
    isFetching: boolean;

}

type ElevateAdminContextProvider = {
    children?: React.ReactNode;
}

export type CompaniesWithMemberCount = Company & {
    member_count?: number;
}

const ElevateAdminContext = createContext<ElevateAdminContextProps | null>(null)

export const ElevateAdminContextProvider = ({children}:ElevateAdminContextProvider) => {
    const [users, setUsers] = useState<User[]>([])
    const [companies, setCompanies] = useState<CompaniesWithMemberCount[] | []>([])
    const [isFetching, setIsFetching] = useState(true)
useEffect(() => {
  async function fetchData() {
    setIsFetching(true)
    try {
      const [usersRes, companiesRes] = await Promise.all([getUsers(), getCompanies()])
      const usersData = usersRes.data ?? []
      const companiesData = companiesRes.data ?? []

      setUsers(usersData)

      const dataWithMemberCount = companiesData.map(c => {
        const members = usersData.filter(u => u.company === c.code)
        return { ...c, member_count: members.length }
      })
      setCompanies(dataWithMemberCount)
    } catch (err) {
      console.error(err)
    } finally {
      setIsFetching(false)
    }
  }

  fetchData()
}, [])



    return <ElevateAdminContext.Provider
    value = {{
        users,
        companies,
        isFetching
    }
    }>
    {children}
    </ElevateAdminContext.Provider>
}


export function useElevateAdminContext() {
  const context = useContext(ElevateAdminContext);
  if (!context) {
    throw new Error(
      "useElevateAdminContext must be used within a ElevateAdminContextProvider"
    );
  }
  return context;
}