import { Button } from '../../../../../shared/ui/src';

export function Search() {
  return (
    <div>
      <h1>Welcome to Train Search!</h1>
      <Button
        className="bg-amber-300 p-2"
        onClick={() => console.log('CLICKED!!')}
      >
        Click me
      </Button>
    </div>
  );
}
