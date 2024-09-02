import { useAppDispatch, useAppSelector } from "../app/hooks"
import { setToasts } from "../app/slices/MeetingSlice";

export default function useTost() {
    const toasts = useAppSelector((zoom) => zoom.meetings.toasts);
    const dispatch = useAppDispatch();
    const createTost = ({title, type} : {title : string, type: any})=>{
        dispatch( setToasts(
            toasts.concat({
                id: new Date().toISOString(),
                title,
                color: type, 
            })
        ))
    }
  return [createTost]
}
