import getPaginated from "app/queries/getPaginated"
import {useInfiniteQuery} from "ritz"
import {Suspense, useState} from "react"

function Content() {
  const [value, setValue] = useState(10)

  const [groups] = useInfiniteQuery(
    getPaginated,
    (page = {take: 5, skip: 0}) => ({
      where: {value: {gte: value}},
      ...page,
    }),
    {
      getNextPageParam: (lastGroup) => lastGroup.nextPage,
    },
  )
  return (
    <>
      <button onClick={() => setValue(value + 1)}>click me</button>
      <div id="content">{JSON.stringify(groups)}</div>
    </>
  )
}

function InfiniteQuery() {
  return (
    <div id="page">
      <Suspense fallback={"Loading..."}>
        <Content />
      </Suspense>
    </div>
  )
}

export default InfiniteQuery
