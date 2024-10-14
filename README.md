

# YugabyteDB FIT 2024 DEMO 

## Overview

YugabyteDB 

## Preparation

```
CREATE TABLESPACE gcp_tablespace WITH (
  replica_placement='{"num_replicas": 1, "placement_blocks":
  [{"cloud":"onprem","region":"asia-northeast2","zone":"asia-northeast2-a","min_num_replicas":1}]}'
);

create table global ( id int, value int);
create table aws ( id int, value int);
create table azure ( id int, value int);
create table gcp ( id int, value int) tablespace gcp_tablespace;

insert into global values (1, 50);
insert into aws values (1, 10);
insert into azure values ( 1, 15);
insert into gcp values (1, 20);

```