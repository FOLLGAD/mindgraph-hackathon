import { redirect } from 'next/navigation'

interface PageProps {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}

const Page = ({ searchParams }: PageProps) => {
    const query = searchParams.query

    if (Array.isArray(query) || !query) {
        return redirect('/')
    }

    return (
        <div className='mt-10 ml-4 text-4xl text-white'>
           {query}
        </div>
    )
}

export default Page