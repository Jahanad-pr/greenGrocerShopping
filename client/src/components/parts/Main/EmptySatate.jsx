import emptyStateImage from '../../../assets/images/noCAtegory.png';

const EmptyState = ({data,action}) => (
    <div className="w-full h-[60vh] mt-20 flex items-center pr-20 justify-center flex-col text-center gap-5">
      <img className="h-[50%]" src={data?.img||emptyStateImage} alt="No categories" />
      <div className="flex flex-col gap-2">
        <h1 className="text-[30px] font-bold">{data?.title}</h1>
        <p className="opacity-45">
          {data?.description}
        </p>
        <p onClick={()=> action()} className="text-[20px] text-blue-600 font-medium cursor-pointer">{data?.button}</p>
      </div>
    </div>
  )

  export default EmptyState