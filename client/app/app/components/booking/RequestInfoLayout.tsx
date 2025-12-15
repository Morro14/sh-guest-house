import Line from '~/components/index/Line'
import { Outlet } from 'react-router'
import { useTranslation } from 'react-i18next'


export default function RequestInfoLayout({ children }) {
  const { t } = useTranslation()
  return <div id="request-info-block" className='flex flex-col items-center mt-[42px]'>
    <h2 className='mb-8 -mt-2'>{t("Your booking request")}</h2>

    <Line />
    <div className='flex py-5 flex-col gap-3 items-center text-center 2xl:w-[600px]'>
      <div className='flex justify-between w-full font-medium'>
        <h4 className='w-[132px]'>Date</h4>
        <h4 className='w-50'>Number of guests</h4>
        <h4 className='w-[132px]'>Nights</h4>
      </div>
      <div className={`${location.pathname === '/booking' ? 'h-[68px]' : 'h-[80px]'} w-full transition-all duration-200`}>
        {children}
      </div>
    </div>
    <Line />
  </div>
}
