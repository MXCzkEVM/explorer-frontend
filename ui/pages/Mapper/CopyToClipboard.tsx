import {
  IconButton,
  Tooltip,
  useClipboard,
  chakra,
  useDisclosure,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import CopyIcon from 'icons/copy.svg';

const CopyToClipboard = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  const { hasCopied, onCopy } = useClipboard(text, 1000);
  const [copied, setCopied] = useState(false);
  // have to implement controlled tooltip because of the issue - https://github.com/chakra-ui/chakra-ui/issues/7107
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (hasCopied) {
      setCopied(true);
    } else {
      setCopied(false);
    }
  }, [hasCopied]);

  return (
    <span>
      <IconButton
        aria-label="copy"
        icon={<CopyIcon />}
        w="20px"
        h="20px"
        variant="simple"
        colorScheme="#25d30f"
        _hover={{ color: '#25d30f' }}
        display="inline-block"
        flexShrink={0}
        onClick={onCopy}
        className={className}
        onMouseEnter={onOpen}
        onMouseLeave={onClose}
      />
      {copied ? 'Copied' : 'Copy'}
    </span>
  );
};

export default React.memo(chakra(CopyToClipboard));
