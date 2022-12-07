import { ContainerListDto } from "./container-list.dto";

export class PostContainerListResponseDto {
  dma_tracking: Array<ContainerListDto>;
  rsMsg?: {
    message?: string;
    statusCode?: string;
  };
}
