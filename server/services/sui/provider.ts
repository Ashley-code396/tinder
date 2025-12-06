import { SuiClient } from '@mysten/sui/client';
import dotenv from 'dotenv'


const client = new SuiClient({
    url: process.env.SUI_FULLNODE_URL || 'https://fullnode.testnet.sui.io:443',

});