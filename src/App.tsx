import { Fragment, useCallback, useEffect, useMemo, useState } from "react"
import { InputSelect } from "./components/InputSelect"
import { Instructions } from "./components/Instructions"
import { Transactions } from "./components/Transactions"
import { useEmployees } from "./hooks/useEmployees"
import { usePaginatedTransactions } from "./hooks/usePaginatedTransactions"
import { useTransactionsByEmployee } from "./hooks/useTransactionsByEmployee"
import { EMPTY_EMPLOYEE } from "./utils/constants"
import { Employee } from "./utils/types"

export function App() {
  const { data: employees, ...employeeUtils } = useEmployees()
  const { data: paginatedTransactions, ...paginatedTransactionsUtils } = usePaginatedTransactions()
  const { data: transactionsByEmployee, ...transactionsByEmployeeUtils } = useTransactionsByEmployee()
  const [isLoading, setIsLoading] = useState(false)

  const transactions = useMemo(
    () => paginatedTransactions?.data ?? transactionsByEmployee ?? null,
    [paginatedTransactions, transactionsByEmployee]
  )

  const loadAllTransactions = useCallback(async () => {
    setIsLoading(true)
    // transactionsByEmployeeUtils.invalidateData() 

    await employeeUtils.fetchAll()
    
    setIsLoading(false)

    await paginatedTransactionsUtils.fetchAll()

    // setIsLoading(false)
  }, [employeeUtils, paginatedTransactionsUtils, transactionsByEmployeeUtils])

  const loadTransactionsByEmployee = useCallback(
    async (employeeId: string) => {
      paginatedTransactionsUtils.invalidateData()
      await transactionsByEmployeeUtils.fetchById(employeeId)
    },
    [paginatedTransactionsUtils, transactionsByEmployeeUtils]
  )

  useEffect(() => {
    if (employees === null && !employeeUtils.loading) {
      loadAllTransactions()
    }
  }, [employeeUtils.loading, employees, loadAllTransactions])

  return (
    <Fragment>
      <main className="MainContainer">
        <Instructions />

        <hr className="RampBreak--l" />

        <InputSelect<Employee>
          isLoading={isLoading}
          defaultValue={EMPTY_EMPLOYEE}
          items={employees === null ? [] : [EMPTY_EMPLOYEE, ...employees]}
          label="Filter by employee"
          loadingLabel="Loading employees"
          parseItem={(item) => ({
            value: item.id,
            label: `${item.firstName} ${item.lastName}`,
          })}
          onChange={async (newValue) => {
            if (newValue === null) {
              return
            }
            // here: whenever we choose a All Employees in the dropdown, as All Employees doesn't have a specific Id,
            // the error arises

            console.log("Selected Id: ", newValue, newValue.id)

            if (newValue.id) {
              await loadTransactionsByEmployee(newValue.id)
            } else {
              await loadAllTransactions()
            }

            
          }}
        />

        <div className="RampBreak--l" />

        <div className="RampGrid">
          <Transactions transactions={transactions} />

          {transactions !== null && paginatedTransactions?.nextPage && (
            <button
              className="RampButton"
              disabled={paginatedTransactionsUtils.loading || !paginatedTransactions?.nextPage}
              onClick={async () => {
                console.log("Transactions: ", transactions)
                await loadAllTransactions()
              }}
            >
              View More
            </button>
          )}
        </div>
      </main>
    </Fragment>
  )
}
