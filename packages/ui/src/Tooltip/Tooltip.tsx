import { Tooltip as ChakraTooltip } from '@chakra-ui/react';

const Tooltip = ({ label, children }: { label?: string; children: React.ReactNode }) => {
  return (
    <ChakraTooltip placement="top" label={label} color={'white'} bgGradient="linear(to-r, red.500,pink.600)">
      {children}
    </ChakraTooltip>
  );
};

export default Tooltip;
