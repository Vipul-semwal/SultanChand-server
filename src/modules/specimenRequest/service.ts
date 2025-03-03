import  { MedusaService } from '@medusajs/framework/utils';
import {  specimenRequest} from './models/specimenRequest';

class  specimenRequestModuleService extends MedusaService({
    specimenRequest,
}) {

}

export default specimenRequestModuleService;