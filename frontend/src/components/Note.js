import { TreeItem } from '@mui/lab';

export default function Note({ familyTree }) {
  return (
    <>
      <TreeItem nodeId={familyTree?.id.toString()} label={familyTree?.title}>
        {familyTree?.children && familyTree?.children.map((child) => (
          <Note familyTree={child} />
        ))}
      </TreeItem>
    </>
  );
}