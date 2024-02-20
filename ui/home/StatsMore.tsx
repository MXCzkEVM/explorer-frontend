import {
  Button,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useDisclosure,
  chakra
} from '@chakra-ui/react';
import React, {useState, useEffect} from 'react';
import StatsItem from './StatsItem';
import dayjs from 'dayjs';

import blockIcon from 'icons/block.svg';
import burgerIcon from 'icons/burger.svg';
import networkIcon from 'icons/networks.svg';
import profileIcon from 'icons/profile.svg';
import abiIcon from 'icons/ABI.svg';
import flameIcon from 'icons/flame.svg';
// import appConfig from 'configs/app';
// import MXCL1 from 'constants/abi/MXCL1';
import {mxczkevmClient} from "constants/graphClient"
import {getMXCBurn} from 'constants/graphql/mxczkevm'

import {
  contractL1, contractL2, l1Provider, l2Provider, l1_Address, oracle_address,
  getPendingTransactions, getQueuedTransactions, getAvailableSlots,
  getLastVerifiedBlockId, getNextBlockId, getLestProposed, getBlockFee } from 'constants/Stats'

var statsTimer: any = null;
  
const StatsMore = () => {
  let [tipsTitle, setTitle] = useState('');
  let [tipsContent, setContent] = useState('');
  let [latestProof, setLatestProof] = useState('');
  let [L1_header, setL1Header] = useState('0x');
  let [L2_header, setL2Header] = useState('0x');
  let [status, setSatus] = useState({
    pending: '0',
    queued: '0',
    availableSlot: '0',
    latestVerifiedId: '0',
    nextBlockId: '0',
    lastProposed: '0',
    // avgProofTime: '0',
    blockFee: '0',
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = React.useRef() as React.MutableRefObject<HTMLInputElement>;
  
  const onTap = (title: string, value: string) => {
    setTitle(title);
    setContent(value);
    onOpen();
  };

  const BlockProven = (
    id: any,
    parentHash: any,
    blockHash: any,
    signalRoot: any,
    prover: any,
    provenAt: any
  ) => {
    if (prover.toLowerCase() !== oracle_address.toLowerCase()) {
      setLatestProof(dayjs(new Date(provenAt)).format('HH:mm:ss'));
    }
  };

  const L1HeaderSynced = (
    lastVerifiedBlockId: any,
    blockHash: any,
    signalRoot: any
  ) => {
    setL1Header(blockHash);
  };

  const L2HeaderSynced = (
    lastVerifiedBlockId: any,
    blockHash: any,
    signalRoot: any
  ) => {
    setL2Header(blockHash);
  };

  useEffect(() => {
    const updataStatus = async () => {
      // L1 Latest Synced Header
      let L1_header = await contractL1.getCrossChainBlockHash(0);
      let L2_header = await contractL2.getCrossChainBlockHash(0);

      let pending = await getPendingTransactions(l2Provider);
      let queued = await getQueuedTransactions(l2Provider);

      let availableSlot = await getAvailableSlots(l1Provider, l1_Address);
      let latestVerifiedId = await getLastVerifiedBlockId(
        l1Provider,
        l1_Address
      );
      const nextBlockId = await getNextBlockId(l1Provider, l1_Address);
      // const avgProofTime = await getAverageProfTime(l1Provider, l1_Address);
      const lastProposed = await getLestProposed(l2Provider);
      const blockFee = await getBlockFee(l1Provider, l1_Address);

      setSatus({
        pending,
        queued,
        availableSlot,
        latestVerifiedId,
        nextBlockId,
        lastProposed,
        // avgProofTime,
        blockFee,
      });
      setL1Header(L1_header);
      setL2Header(L2_header);
    };
    if (statsTimer) {
      clearInterval(statsTimer);
    }
    statsTimer = setInterval(() => updataStatus(), 20000);
    updataStatus();

    contractL1.on('BlockProven', BlockProven);
    contractL1.on('CrossChainSynced', L1HeaderSynced);
    contractL2.on('CrossChainSynced', L2HeaderSynced);

    return () => {
      // console.log('clear');
      if (statsTimer) {
        clearInterval(statsTimer);
      }
      contractL1.removeListener('BlockProven', BlockProven);
      contractL1.removeListener('CrossChainSynced', L1HeaderSynced);
      contractL2.removeListener('CrossChainSynced', L2HeaderSynced);
    };
  }, []);

  const [burnsTotal, setBurnsTotal] = useState("0")
  useEffect(() => {
    const fetchData = async () => {
      const result = await mxczkevmClient.query({
        query: getMXCBurn(),
      })
      let burns = result?.data?.bundle.burn || 0      
      setBurnsTotal(parseInt(burns).toString())
    }
    fetchData()
  }, [])

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {tipsTitle}
            </AlertDialogHeader>

            <AlertDialogBody>{tipsContent}</AlertDialogBody>

            <AlertDialogFooter
              display="flex"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button onClick={onClose}>Confirm</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <StatsItem
        icon={abiIcon}
        title="L1 Latest Synced Header"
        value={L1_header}
        showTips="The most recent Layer 2 Header that has been synchronized with the MXCL1 smart contract."
        tap={onTap}
      />
      <StatsItem
        icon={abiIcon}
        title="L2 Latest Synced Header"
        value={L2_header}
        showTips="The most recent Layer 1 Header that has been synchronized with the MXCL2 smart contract. The headers are synchronized with every L2 block."
        tap={onTap}
      />
      <StatsItem
        icon={burgerIcon}
        title="Tx Mempool (pending)"
        value={status.pending}
        showTips="The current processable transactions in the mempool that have not been added to a block yet."
        tap={onTap}
      />
      <StatsItem
        icon={burgerIcon}
        title="Tx Mempool (queued)"
        value={status.queued}
        showTips="The current transactions in the mempool where the transaction nonce is not in sequence. They are currently non-processable."
        tap={onTap}
      />
      <StatsItem
        icon={networkIcon}
        title="Available Slots"
        value={status.availableSlot}
        showTips="The amount of slots for proposed blocks on the MXCL1 smart contract. When this number is 0, no blocks can be proposed until a block has been proven."
        tap={onTap}
      />
      {/* <StatsItem
        icon={blockIcon}
        title="Last Verified Block ID"
        value={status.latestVerifiedId}
        showTips="The most recently verified Layer 2 block on the MXCL1 smart contract."
        tap={onTap}
      /> */}
      
      <StatsItem
        icon={flameIcon}
        title="Total Burnt MXC"
        value={burnsTotal}
        showTips="Total MXC burnt amounts."
        tap={onTap}
      />
      <StatsItem
        icon={blockIcon}
        title="Next Block ID"
        value={status.nextBlockId}
        showTips="The ID that the next proposed block on the MXCL1 smart contract will receive."
        tap={onTap}
      />
      <StatsItem
        icon={profileIcon}
        title="Latest Proposal"
        value={status.lastProposed || '0'}
        showTips="The most recent block proposal on MXCL1 contract."
        tap={onTap}
      />
      <StatsItem
        icon={profileIcon}
        title={'Latest Proof'}
        value={latestProof || '0'}
        showTips="The most recent block proof submitted on MXCL1 contract."
        tap={onTap}
      />
      {/* <StatsItem
        icon={clockIcon}
        title={'Average Proof Time'}
        value={`${status.avgProofTime} seconds`}
        showTips="The current average proof time, updated when a block is successfully proven."
        tap={onTap}
      /> */}
      <StatsItem
        icon={flameIcon}
        title={'Block Fee'}
        value={status.blockFee || '0'}
        showTips="The current fee to propose a block to the MXCL1 smart contract."
        tap={onTap}
      />
    </>
  );
};

export default chakra(StatsMore);
