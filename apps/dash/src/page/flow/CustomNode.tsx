import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box } from 'lucide-react';
 
function CustomNode({ data }: { data: any }) {
  return (
    <div className="flex flex-col items-center p-6 rounded-lg border bg-card hover:shadow-md transition-shadow min-w-[200px]">
      
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-4 h-4 bg-primary/50 rounded-full" 
      />
      
      <div className="p-3 rounded-full bg-primary/10 text-primary mb-4">
        <Box className="w-6 h-6" />
      </div>
      
      {typeof data.label === 'string' ? (
        <h3 className="text-lg font-semibold mb-2">{data.label}</h3>
      ) : (
        data.label
      )}
      
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-4 h-4 bg-primary/50 rounded-full" 
      />
    </div>
  );
}
 
export default memo(CustomNode);