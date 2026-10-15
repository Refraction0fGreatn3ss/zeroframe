import { Database, Laptop, Radio, Server, User } from 'lucide-react';
import type { FC } from 'react';
import type { TopologyNodeType } from './entity-graph.types';

export const NodeTypeIcon: FC<{ type: TopologyNodeType }> = ({ type }) => {
  switch (type) {
    case 'EXTERNAL_C2':
      return <Radio className="w-4 h-4 text-rose-400" />;
    case 'COMPROMISED_HOST':
      return <Server className="w-4 h-4 text-rose-400" />;
    case 'CROWN_JEWEL':
      return <Database className="w-4 h-4 text-amber-400" />;
    case 'IDENTITY':
      return <User className="w-4 h-4 text-violet-400" />;
    default:
      return <Laptop className="w-4 h-4 text-cyan-400" />;
  }
};
