import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import Image from 'next/image';


const LoadingDialog = ({ loading }) => {
  return (
    <AlertDialog open={loading}>
  
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle className="sr-only">Loading Course</AlertDialogTitle>
      <AlertDialogDescription>
       <div className='flex flex-col items-center justify-center p-10'>
        <Image src={"/loading.gif"} alt="Loading..." width={100} height={100} />
        <div className="text-center font-bold mt-4 text-lg">Please Wait...AI Working on your Course</div>
       </div>
      </AlertDialogDescription>
    </AlertDialogHeader>
    
  </AlertDialogContent>
</AlertDialog>
  )
}

export default LoadingDialog
