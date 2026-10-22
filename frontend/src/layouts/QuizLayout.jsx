import { Outlet } from 'react-router-dom';

export default function QuizLayout() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-slate-100">
      <Outlet />   
    </div>
  );
}