import { useAuth } from "@/auth/useAuth";

interface DeleteButtonProps {
   issue_id: string;
   author_id: string;
   onDelete?: (issue_id: string) => void;
}

function DeleteButton({ issue_id, author_id, onDelete }: DeleteButtonProps) {
   const { user } = useAuth();

   const canDelete = user && user.id === author_id ? true : false;

   const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation(); // stops going to the parent event (going to the detailed post)

      if (canDelete && onDelete) {
         onDelete(issue_id);
      }
   };

   return (
      <button
         onClick={handleDelete}
         className='absolute top-1 right-1 text-gray-500 hover:text-gray-700 font-bold text-lg cursor-pointer'
         title='Delete'
      >
         ✕
      </button>
   );
}
export default DeleteButton;
