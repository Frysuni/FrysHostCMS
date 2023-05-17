import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";
import { InjectRepository } from "@nestjs/typeorm";
import { ApiException } from "@system/apiException";
import { isBase64, IsBase64 } from "class-validator";
import MinecraftSkinConverter from "minecraft-skin-converter";
import { chmodSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { resolve } from "path";
import { Repository } from "typeorm";
import { AssetsEntity } from "./entities/assets.entity";
import { UsersEntity } from "./entities/users.entity";

@Injectable()
export class AssetsService {
  constructor(
    @InjectRepository(UsersEntity) private usersRepository: Repository<UsersEntity>,
    @InjectRepository(AssetsEntity) private assetsRepository: Repository<AssetsEntity>,
  ) {
    if (!existsSync(this.assetsDir)) mkdirSync(this.assetsDir);
  }

  private readonly assetsDir = resolve(__dirname, '../../../assets');

  private write(path: string, data: string | NodeJS.ArrayBufferView) {
    path = resolve(this.assetsDir, path);
    if (existsSync(path)) rmSync(path);
    writeFileSync(path, data);
    if (process.platform != 'win32') chmodSync(path, 0o755);
  }

  async setSkin(uuid: string, acceptHd: boolean, data: string)  {
    const regex = /data:image\/.*;base64,/;
    if (!data.replace(regex, '__FrysHost__').includes('__FrysHost__') || !isBase64(data.replace(regex, ''))) throw new ApiException('BAD_REQUEST', 'AssetsService: Wrong skin/cape input');

    const converter = new MinecraftSkinConverter(data, 'buffer/png');
    const skin = await converter.convertSkin().catch(() => { throw new ApiException('BAD_REQUEST', 'AssetsService: Wrong skin/cape input'); });
    if (skin.hd && !acceptHd) throw new ApiException('FORBIDDEN', 'AssetsService: Unallowed HD skin/cape');

    await this.assetsRepository.delete({ user: uuid, type: 'skin' });
    await this.assetsRepository.save({ type: 'skin', hd: skin.hd, slim: skin.slim, user: uuid });

    this.write(uuid + '_skin', skin.data);
  }

}