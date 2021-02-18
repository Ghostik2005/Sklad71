# coding: utf-8

import sys
import time
import json
import datetime

class ORDERS:

    def __init__(self, parent):
        self.parent = parent

    def _execute(self, sql):
        return self.parent._execute(sql)

    def get_orders_document_for_shipment(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " get_orders_document_for_shipment ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " get_orders_document_for_shipment ", "*"*10)
        doc_id = kwargs.get('doc_id')
        ret = []
        if doc_id:
#             sql = f""" select job.n_id as order_id,
# job.n_doc_id as order_doc_id,
# rp.c_name as prod_name,
# replace((job.n_product->'n_code')::text, '"', '') as prod_code,
# job.n_product->'n_amount' as order_amount,
# coalesce((job.n_product->'n_price')::int, 0) as order_price,
# (job.n_product->'n_product') as order_prod,
# job.n_product->'n_man' as order_man,
# job.n_product->'n_comment' as order_comment,
# rp.c_id as prod_id,
# jpb.n_id as balance_id,
# coalesce(jpb.n_quantity, 0) as balance_quan,
# (job.n_product->'n_amount')::int*(job.n_product->'n_price')::int as summ,
# coalesce(jpb.n_price,0) as n_price,
# coalesce(jpb.n_vat, 0) as n_vat,
# coalesce(jpb.n_quantity, 0) as n_stock
# from journals_orders_bodies job
# left join ref_products rp on (rp.c_nnt::text = replace((job.n_product->'n_code')::text, '"', ''))
# left join journals_products_balance jpb
# 	on (jpb.n_product_id = rp.c_id
# 		and (job.n_product->'n_price')::int = (select case
# 											   when jpb1.n_vat_included is true then jpb1.n_price::int
# 											   else (jpb1.n_price+jpb1.n_vat)::int
# 											   end
# 											   from journals_products_balance jpb1
# 											   where jpb1.n_id = jpb.n_id
# 											 )
# 		   )
# where job.n_doc_id = {int(doc_id)}
# and not n_deleted
# order by job.n_id
# """
#             sql_old = f"""with get_d as (
# 	select n_id, coalesce(n_quantity, 0) as n_quantity, n_product_id from journals_products_balance
# 	order by n_quantity desc
# )
# select job.n_id as order_id,
# job.n_doc_id as order_doc_id,
# rp.c_name as prod_name,
# replace((job.n_product->'n_code')::text, '"', '') as prod_code, --код товара
# job.n_product->'n_amount' as order_amount,
# coalesce((job.n_product->'n_price')::int, 0) as order_price,
# (job.n_product->'n_product') as order_prod,
# job.n_product->'n_man' as order_man,
# job.n_product->'n_comment' as order_comment,
# rp.c_id as prod_id, -- id в товарах
# case
# 	when (job.n_product->'n_amount')::int > coalesce(jpb.n_quantity, 0)
# 		then (select n_id from get_d where n_product_id = jpb.n_product_id limit 1)
# 	else jpb.n_id
# end
# as balance_id,
# case
# 	when (job.n_product->'n_amount')::int > coalesce(jpb.n_quantity, 0)
# 		then (select n_quantity from get_d where n_product_id = jpb.n_product_id limit 1)
# 	else coalesce(jpb.n_quantity, 0)
# end
# as balance_quan,
# (job.n_product->'n_amount')::int*(job.n_product->'n_price')::int as summ,
# coalesce(jpb.n_price,0) as n_price,
# coalesce(jpb.n_vat, 0) as n_vat,
# case
# 	when (job.n_product->'n_amount')::int > coalesce(jpb.n_quantity, 0)
# 		then (select n_quantity from get_d where n_product_id = jpb.n_product_id limit 1)
# 	else coalesce(jpb.n_quantity, 0)
# end
# as n_stock
# from journals_orders_bodies job
# left join ref_products rp on (rp.c_nnt::text = replace((job.n_product->'n_code')::text, '"', ''))
# left join journals_products_balance jpb
# 	on (jpb.n_product_id = rp.c_id
# 		and (job.n_product->'n_price')::int = (select case
# 			   when jpb1.n_vat_included is true then jpb1.n_price::int
# 			   else (jpb1.n_price+jpb1.n_vat)::int
# 			   end
# 			   from journals_products_balance jpb1
# 			   where jpb1.n_id = jpb.n_id
# 			 )
# 	   )
# where job.n_doc_id = {int(doc_id)}
# and not n_deleted
# order by job.n_id """
            sql_old = f"""
select job.n_id as order_id,
job.n_doc_id as order_doc_id,
rp.c_name as prod_name,
replace((job.n_product->'n_code')::text, '"', '') as prod_code, --код товара
job.n_product->'n_amount' as order_amount,
coalesce((job.n_product->'n_price')::int, 0) as order_price,
(job.n_product->'n_product') as order_prod,
job.n_product->'n_man' as order_man,
job.n_product->'n_comment' as order_comment,
rp.c_id as prod_id, -- id в товарах
(select d.n_product_id from (
	select j1.n_product_id as n_product_id, max(coalesce(j1.n_quantity, 0)) as qq
	from journals_products_balance j1
	where j1.n_product_id=rp.c_id
	group by j1.n_product_id) as d
) as balance_id,
(select d2.qq from (
	select j1.n_product_id as n_product_id, max(coalesce(j1.n_quantity, 0)) as qq
	from journals_products_balance j1
	where j1.n_product_id=rp.c_id
	group by j1.n_product_id) as d2
	) as balance_quan,
(job.n_product->'n_amount')::int*(job.n_product->'n_price')::int as summ,
(select  jj1.n_price
 	from journals_products_balance jj1
 	where jj1.n_product_id =
  	(select d2.n_product_id
  		from (
 		select j1.n_product_id as n_product_id, max(coalesce(j1.n_quantity, 0)) as qq
 		from journals_products_balance j1
 		where j1.n_product_id=rp.c_id
 		group by j1.n_product_id) as d2
 	)
 	limit 1
) as n_price,
(select  jj1.n_vat
 	from journals_products_balance jj1
 	where jj1.n_product_id =
  	(select d2.n_product_id
  		from (
 		select j1.n_product_id as n_product_id, max(coalesce(j1.n_quantity, 0)) as qq
 		from journals_products_balance j1
 		where j1.n_product_id=rp.c_id
 		group by j1.n_product_id) as d2
 	)
 	limit 1
) as n_vat,
(select d2.qq from (
			select j1.n_product_id as n_product_id, max(coalesce(j1.n_quantity, 0)) as qq from journals_products_balance j1 where j1.n_product_id=rp.c_id group by j1.n_product_id) as d2
			) as n_stock
from journals_orders_bodies job
left join ref_products rp on (rp.c_nnt::text = replace((job.n_product->'n_code')::text, '"', ''))
where job.n_doc_id = {int(doc_id)}
and not job.n_deleted
order by job.n_id """

            sql = f"""select job.n_id as order_id,
job.n_doc_id as order_doc_id,
rp.c_name as prod_name,
replace((job.n_product->'n_code')::text, '"', '') as prod_code, --код товара
job.n_product->'n_amount' as order_amount,
coalesce((job.n_product->'n_price')::int, 0) as order_price,
(job.n_product->'n_product') as order_prod,
job.n_product->'n_man' as order_man,
job.n_product->'n_comment' as order_comment,
rp.c_id as prod_id, -- id в товарах
(select d.n_id from (
	select j1.n_id as n_id, max(coalesce(j1.n_quantity, 0)) as qq
	from journals_products_balance j1
	where j1.n_product_id=rp.c_id
	group by j1.n_id
	order by 2 desc) as d
 	limit 1
) as balance_id,
(select d2.qq from (
	select j2.n_id as n_id, max(coalesce(j2.n_quantity, 0)) as qq
	from journals_products_balance j2
	where j2.n_product_id=rp.c_id
	group by j2.n_id
	order by 2 desc) as d2
 	limit 1
	) as balance_quan,
(job.n_product->'n_amount')::int*(job.n_product->'n_price')::int as summ,
(select  jj1.n_price
 	from journals_products_balance jj1
 	where jj1.n_id =
  	(select d2.n_id
  		from (
 		select j1.n_id as n_id, max(coalesce(j1.n_quantity, 0)) as qq
 		from journals_products_balance j1
 		where j1.n_product_id=rp.c_id
 		group by j1.n_id
		order by 2 desc) as d2
	 	limit 1
 	)
) as n_price,
(select  jj1.n_vat
 	from journals_products_balance jj1
 	where jj1.n_id =
  	(select d2.n_id
  		from (
 		select j1.n_id as n_id, max(coalesce(j1.n_quantity, 0)) as qq
 		from journals_products_balance j1
 		where j1.n_product_id=rp.c_id
 		group by j1.n_id
		order by 2 desc) as d2
		limit 1
 	)
) as n_vat,
(select d2.qq from (
	select j1.n_id as n_id, max(coalesce(j1.n_quantity, 0)) as qq
	from journals_products_balance j1
	where j1.n_product_id=rp.c_id
	group by j1.n_id
	order by 2 desc) as d2
 	limit 1
	) as n_stock,
rp.c_limit_excl
from journals_orders_bodies job
left join ref_products rp on (rp.c_nnt::text = replace((job.n_product->'n_code')::text, '"', ''))
where job.n_doc_id = {int(doc_id)}
and not job.n_deleted
order by job.n_id
            """

            ret = self._execute(sql)
        t1 = time.time() - t
        res = []
        for i, row in enumerate(ret):

            row[4] = 0 if not row[4] else row[4]
            row[15] = 0 if not row[15] else row[15]
            nnvs = int(row[4])*int(row[5])
            nvs = int(row[4])*int(row[14])
            r = {
                "row_num": i,
                # "n_id": str(row[0]),
                "n_doc_id": str(row[1]), #id документа
                "n_product": row[2], #название в остатках
                "n_code": row[3], #код товара в справочнике
                "n_amount": row[4], #количнество в заказе
                "n_ship_price": row[5],#цена в заказе
                "n_product_order": row[6], #название в заказе
                "n_man": row[7], #проиводитель в заказе
                "n_comment": row[8], #комментарий к позиции
                "n_prod_id": str(row[9]), #id товара в справочнике товаров
                "n_balance_id": str(row[10]), #id товара в остатках
                "n_balance_qty": row[11], #остаток на складе
                "n_total_summ": row[12], #сумма по позиции
                "n_price": row[13], #цена прихода
                "n_vat":  row[14],
                "n_novats_summ": nnvs,
                "n_charge": 0 if not row[13] else round(int(row[5] if row[5] else 0)/int(row[13])*100-100, 2),
                "n_vats_summ": nvs,
                "n_stock": row[15], #остаток на складе
                "warning": row[15]<row[4],
                "c_limit_excl": row[16]
            }
            res.append(r)
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def get_orders_document(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " get_orders_document ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " get_orders_document ", "*"*10)
        doc_id = kwargs.get('doc_id')
        ret = []
        if doc_id:
            sql_old = f"""select job.n_id as order_id,
job.n_doc_id as order_doc_id,
rp.c_name as prod_name,
replace((job.n_product->'n_code')::text, '"', '') as prod_code,
job.n_product->'n_amount' as order_amount,
job.n_product->'n_price' as order_price,
(job.n_product->'n_product') as order_prod,
job.n_product->'n_man' as order_man,
job.n_product->'n_comment' as order_comment,
rp.c_id as prod_id,
jpb.n_id as balance_id,
coalesce(jpb.n_quantity, 0) as balance_quan,
(job.n_product->'n_amount')::int*(job.n_product->'n_price')::int as summ
from journals_orders_bodies job
left join ref_products rp on (rp.c_nnt::text = replace((job.n_product->'n_code')::text, '"', ''))
left join journals_products_balance jpb
	on (jpb.n_product_id = rp.c_id
		and (job.n_product->'n_price')::int = (select case
											   when jpb1.n_vat_included is true then jpb1.n_price::int
											   else (jpb1.n_price+jpb1.n_vat)::int
											   end
											   from journals_products_balance jpb1
											   where jpb1.n_id = jpb.n_id
											 )
		   )
where job.n_doc_id = {int(doc_id)}
and not n_deleted
order by job.n_id
            """
            sql = f"""select job.n_id as order_id,
job.n_doc_id as order_doc_id,
rp.c_name as prod_name,
replace((job.n_product->'n_code')::text, '"', '') as prod_code,
job.n_product->'n_amount' as order_amount,
job.n_product->'n_price' as order_price,
(job.n_product->'n_product') as order_prod,
job.n_product->'n_man' as order_man,
job.n_product->'n_comment' as order_comment,
rp.c_id as prod_id,
(select d.n_product_id from (
			select j1.n_product_id as n_product_id, max(coalesce(j1.n_quantity, 0)) as qq from journals_products_balance j1 where j1.n_product_id=rp.c_id group by j1.n_product_id) as d
			) as balance_id,
(select d2.qq from (
			select j1.n_product_id as n_product_id, max(coalesce(j1.n_quantity, 0)) as qq from journals_products_balance j1 where j1.n_product_id=rp.c_id group by j1.n_product_id) as d2
			) as balance_quan,
(job.n_product->'n_amount')::int*(job.n_product->'n_price')::int as summ
from journals_orders_bodies job
left join ref_products rp on (rp.c_nnt::text = replace((job.n_product->'n_code')::text, '"', ''))
where job.n_doc_id = {int(doc_id)}
and not n_deleted
order by job.n_id
            """
            ret = self._execute(sql)
        t1 = time.time() - t
        res = []
        for i, row in enumerate(ret):
            r = {
                "row_num": i,
                "n_id": str(row[0]),
                "n_doc_id": str(row[1]), #id документа
                "n_product": row[2], #название в остатках
                "n_code": row[3], #код товара в справочнике
                "n_amount": row[4], #количнество в заказе
                "n_price": row[5], #цена в заказе
                "n_product_order": row[6], #название в заказе
                "n_man": row[7], #проиводитель в заказе
                "n_comment": row[8], #комментарий к позиции
                "n_prod_id": str(row[9]), #id товара в справочнике товаров
                "n_balance_id": str(row[10]), #id товара в остатках
                "n_balance_qty": row[11], #остаток на складе
                "n_total_summ": row[12] #сумма по позиции
            }
            res.append(r)
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer




    def _set_order_get_data(self, field):
        if field == 'n_recipient':
            field = 'rec.n_name'
        else:
            field = f'joh.{field}'
        return field

    def _set_where_get_data(self, params=None):
        inserts = []
        if params:
            # self.parent._print(params)
            n_state = params.get('n_state')
            n_name = params.get('n_name')
            n_inn = params.get('n_inn')
            n_dt_create = params.get('n_dt_invoice')
            n_number = params.get('n_number')
            n_dt_send = params.get('n_dt_send')
            n_recipient = params.get('n_recipient')
            n_summ = params.get('n_summ')
            n_pos_numbers = params.get('n_pos_numbers')
            n_dt_recieved = params.get('n_dt_recieved')
            n_dt_price = params.get('n_dt_price')
            n_code = params.get('n_code')
            n_id_field = params.get('n_id_field')
            search_bar = params.get('search_bar')
            if search_bar:
                r = f"""lower(rec.n_name) like lower('%{search_bar}%')"""
                inserts.append(r)

            if n_state:
                r = f"""joh.n_state = {int(n_state)}"""
                inserts.append(r)
            if n_name:
                r = f"""joh.n_name in ({n_name})"""
                inserts.append(r)
            if n_inn:
                if n_inn.startswith('='):
                    r = f"""joh.n_inn = '{n_inn.replace('=', '')}'"""
                else:
                    r = f"""joh.n_inn like '{n_inn}%'"""
                inserts.append(r)
            if n_dt_create:
                start = n_dt_create.get('start')
                end = n_dt_create.get('end')
                if start and end:
                    r = f"""(joh.n_dt_create >= '{str(start)}' and joh.n_dt_create <= '{str(end)}')"""
                    inserts.append(r)
                elif start:
                    r = f"""joh.n_dt_create::date = '{str(start)}'::date"""
                    inserts.append(r)
            if n_number:
                if n_number.startswith('='):
                    r = f"""joh.n_number = '{n_number.replace('=', '')}'"""
                else:
                    r = f"""joh.n_number like '{n_number}%'"""
                inserts.append(r)
            if n_dt_send:
                start = n_dt_send.get('start')
                end = n_dt_send.get('end')
                if start and end:
                    r = f"""(joh.n_dt_send >= '{str(start)}' and joh.n_dt_send <= '{str(end)}')"""
                    inserts.append(r)
                elif start:
                    r = f"""joh.n_dt_send::date = '{str(start)}'::date"""
                    inserts.append(r)
            if n_recipient:
                r = f"""joh.n_recipient_id in ({n_recipient})"""
                inserts.append(r)
            if n_summ:
                if n_summ.startswith('='):
                    r = f"""joh.n_summ = {float(n_summ.replace('=', '').strip())*100}::int"""
                elif n_summ.startswith('>'):
                    r = f"""joh.n_summ >= {float(n_summ.replace('>', '').strip())*100}::int"""
                elif n_summ.startswith('<'):
                    r = f"""joh.n_summ <= {float(n_summ.replace('<', '').strip())*100}::int"""
                else:
                    r = f"""joh.n_summ::text like  '{n_summ.strip()}%'"""
                inserts.append(r)
            if n_pos_numbers:
                if n_pos_numbers.startswith('='):
                    r = f"""joh.n_pos_numbers = {float(n_pos_numbers.replace('=', '').strip())}::int"""
                elif n_pos_numbers.startswith('>'):
                    r = f"""joh.n_pos_numbers >= {float(n_pos_numbers.replace('>', '').strip())}::int"""
                elif n_pos_numbers.startswith('<'):
                    r = f"""joh.n_pos_numbers <= {float(n_pos_numbers.replace('<', '').strip())}::int"""
                else:
                    r = f"""joh.n_pos_numbers::text like  '{n_pos_numbers.strip()}%'"""
                inserts.append(r)
            if n_dt_recieved:
                start = n_dt_recieved.get('start')
                end = n_dt_recieved.get('end')
                if start and end:
                    r = f"""(joh.n_dt_recieved >= '{str(start)}' and joh.n_dt_recieved <= '{str(end)}')"""
                    inserts.append(r)
                elif start:
                    r = f"""joh.n_dt_recieved::date = '{str(start)}'::date"""
                    inserts.append(r)
            if n_dt_price:
                start = n_dt_price.get('start')
                end = n_dt_price.get('end')
                if start and end:
                    r = f"""(joh.n_dt_price >= '{str(start)}' and joh.n_dt_price <= '{str(end)}')"""
                    inserts.append(r)
                elif start:
                    r = f"""joh.n_dt_price::date = '{str(start)}'::date"""
                    inserts.append(r)
            if n_code:
                if n_code.startswith('='):
                    r = f"""joh.n_code = '{n_code.replace('=', '')}'"""
                else:
                    r = f"""joh.n_code like '{n_code}%'"""
                inserts.append(r)
            if n_id_field:
                if n_id_field.startswith('='):
                    r = f"""joh.n_id_field = '{n_id_field.replace('=', '')}'"""
                else:
                    r = f"""joh.n_id_field like '{n_id_field}%'"""
                inserts.append(r)
        where = 'where '+' and '.join(inserts) if inserts else ''
        return where

    def get_data(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " get_data ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " get_data ", "*"*10)
        filters = kwargs.get('filters')
        if filters:
            field = filters['sort']['id']
            direction = filters['sort']['dir']
            offset = filters.get('start', 0)
            count = filters.get('count', 17)
        else:
            field = 'n_id'
            direction = 'asc'

        where = self._set_where_get_data(filters.get('filters'))

        order = f"""\norder by {self._set_order_get_data(field)} {direction}, 1 asc\n"""
        limits = f"""limit {count} offset {offset}"""

        sql = """select joh.n_id, joh.n_state, joh.n_supplier, s.n_name, joh.n_filename,
	joh.n_id_field, joh.n_name,
	joh.n_p_id, joh.n_code, joh.n_inn,
	joh.n_dt_price, joh.n_dt_create,
    joh.n_number, joh.n_dt_send, joh.n_recipient,
	joh.n_recipient_id, rec.n_name, joh.n_summ, joh.n_pos_numbers,
    joh.n_dt_recieved, joh.n_comment
from journals_orders_headers joh
join ref_partners s on (joh.n_supplier = s.n_id)
join ref_partners rec on (joh.n_recipient_id = rec.n_id)
"""
        sql_count = f"""select count(*) from ({sql+where}) as ccc"""
        sql += where + order + limits
        self.parent._print(sql)
        rows = self._execute(sql) or []
        cou = self._execute(sql_count)
        t1 = time.time() - t
        ret = []
        if cou:
            cou = cou[0][0]
        else:
            cou = 0
        for i, row in enumerate(rows):
            r = {
                "row_num": i,
                "n_id": str(row[0]),
                "n_state": row[1],
                "n_supplier_id": str(row[2]),
                "n_supplier": row[3],
                'n_filename': row[4],
                'n_id_field': row[5],
                'n_name': row[6],
                'n_p_id': str(row[7]),
                'n_code': row[8],
                'n_inn': row[9],
                'n_dt_price': row[10],
                'n_dt_invoice': row[11],
                'n_number': row[12],
                'n_dt_send': row[13],
                'n_recipient': row[14],
                'n_recipient_id': str(row[15]),
                'n_summ': row[17],
                'n_pos_numbers': row[18],
                'n_dt_recieved': row[19],
                "n_comment": row[20],
            }
            # self.parent._print(r)
            ret.append(r)
        t2 = time.time() - t1 - t
        answer = {"pos": offset, "total_count": cou, "data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
                  }
        return answer


#     def get_filter_list(self, *args, **kwargs):
#         t = time.time()
#         self.parent._print("*"*10, " get_filter_list ", "*"*10)
#         self.parent._print(args)
#         self.parent._print(kwargs)
#         self.parent._print("*"*10, " get_filter_list ", "*"*10)
#         c_name = kwargs.get('filterName')
#         rows = []
#         if c_name:
#             if c_name == 'n_state':
#                 sql = f"""select n_value, n_id
# from ref_states
# order by n_value asc"""
#             elif c_name == 'n_paid':
#                 sql = f"""select n_value, n_id
# from ref_paids
# order by n_value asc"""
#             elif c_name == 'n_supplier':
#                 sql = f"""select n_name, n_id
# from ref_partners
# where n_type = (select n_id from ref_partners_types where n_name = 'Поставщик')
# order by n_name asc"""
#             elif c_name == 'n_recipient':
#                 sql = f"""select n_name, n_id
# from ref_partners
# where n_type = (select n_id from ref_partners_types where n_name = 'Получатель')
# order by n_name asc"""
#             elif c_name == 'n_executor':
#                 sql = f"""select n_name, n_id
# from ref_employees
# order by n_name asc"""
#             else:
#                 sql = f"""select distinct {c_name}, null
# from journals_orders_headers
# order by {c_name} asc"""
#             rows = self._execute(sql)
#         t1 = time.time() - t
#         ret = []
#         for c, row in enumerate(rows, 1):
#             r = {"id": str(row[1]) or str(c), "value": row[0]}
#             ret.append(r)

#         t2 = time.time() - t1 - t
#         answer = {"data": ret, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
#         return answer

#     def _set_where_get_data(self, params=None):
#         inserts = []
#         if params:
#             # self.parent._print(params)
#             n_number = params.get('n_number')
#             n_state = params.get('n_state')
#             n_dt_invoice = params.get('n_dt_invoice')
#             n_supplier = params.get('n_supplier')
#             n_recipient = params.get('n_recipient')
#             n_summ = params.get('n_summ')
#             n_nds = params.get('n_nds')
#             n_pos_numbers = params.get('n_pos_numbers')
#             n_executor = params.get('n_executor')
#             n_base = params.get('n_base')
#             n_paid = params.get('n_paid')
#             n_dt_change = params.get('n_dt_change')
#             if n_number:
#                 if n_number.startswith('='):
#                     r = f"""jah.n_number = '{n_number.replace('=', '')}'"""
#                 else:
#                     r = f"""jah.n_number like '{n_number}%'"""
#                 inserts.append(r)
#             if n_state:
#                 r = f"""jah.n_state = {int(n_state)}"""
#                 inserts.append(r)
#             if n_dt_invoice:
#                 start = n_dt_invoice.get('start')
#                 end = n_dt_invoice.get('end')
#                 if start and end:
#                     r = f"""(jah.n_dt_invoice >= '{str(start)}' and jah.n_dt_invoice <= '{str(end)}')"""
#                     inserts.append(r)
#                 elif start:
#                     r = f"""jah.n_dt_invoice::date = '{str(start)}'::date"""
#                     inserts.append(r)
#             if n_supplier:
#                 r = f"""jah.n_supplier in ({n_supplier})"""
#                 inserts.append(r)
#             if n_recipient:
#                 r = f"""jah.n_recipient in ({n_recipient})"""
#                 inserts.append(r)
#             if n_summ:
#                 if n_summ.startswith('='):
#                     r = f"""jah.n_summ = {float(n_summ.replace('=', '').strip())*100}::int"""
#                 elif n_summ.startswith('>'):
#                     r = f"""jah.n_summ >= {float(n_summ.replace('>', '').strip())*100}::int"""
#                 elif n_summ.startswith('<'):
#                     r = f"""jah.n_summ <= {float(n_summ.replace('<', '').strip())*100}::int"""
#                 else:
#                     r = f"""jah.n_summ::text like  '{n_summ.strip()}%'"""
#                 inserts.append(r)
#             if n_nds:
#                 if n_nds.startswith('='):
#                     r = f"""jah.n_nds = {float(n_nds.replace('=', '').strip())*100}::int"""
#                 elif n_nds.startswith('>'):
#                     r = f"""jah.n_nds >= {float(n_nds.replace('>', '').strip())*100}::int"""
#                 elif n_nds.startswith('<'):
#                     r = f"""jah.n_nds <= {float(n_nds.replace('<', '').strip())*100}::int"""
#                 else:
#                     r = f"""jah.n_nds::text like  '{n_nds.strip()}%'"""
#                 inserts.append(r)
#             if n_pos_numbers:
#                 if n_pos_numbers.startswith('='):
#                     r = f"""jah.n_pos_numbers = {float(n_pos_numbers.replace('=', '').strip())}::int"""
#                 elif n_pos_numbers.startswith('>'):
#                     r = f"""jah.n_pos_numbers >= {float(n_pos_numbers.replace('>', '').strip())}::int"""
#                 elif n_pos_numbers.startswith('<'):
#                     r = f"""jah.n_pos_numbers <= {float(n_pos_numbers.replace('<', '').strip())}::int"""
#                 else:
#                     r = f"""jah.n_pos_numbers::text like  '{n_pos_numbers.strip()}%'"""
#                 inserts.append(r)
#             if n_executor:
#                 r = f"""jah.n_executor in ({n_executor})"""
#                 inserts.append(r)
#             if n_base:
#                 r = f"""jah.n_base like '%{n_base.strip()}%'"""
#                 inserts.append(r)
#             if n_paid:
#                 r = f"""jah.n_paid = {int(n_paid)}"""
#                 inserts.append(r)
#             if n_dt_change:
#                 start = n_dt_change.get('start')
#                 end = n_dt_change.get('end')
#                 if start and end:
#                     r = f"""(jah.n_dt_change >= '{str(start)}' and jah.n_dt_change <= '{str(end)}')"""
#                     inserts.append(r)
#                 elif start:
#                     r = f"""jah.n_dt_change::date = '{str(start)}'::date"""
#                     inserts.append(r)
#         where = 'where '+' and '.join(inserts) if inserts else ''
#         return where

#     def _make_sql_upd_header(self, header):
#         n_base = header.get('n_base')
#         n_recipient = header.get('n_recipient')
#         n_number = header.get('n_number')
#         n_dt_invoice = header.get('n_dt_document')
#         n_supplier = header.get('n_supplier')
#         n_id = header.get('n_id')
#         n_exec = header.get('n_executor')
#         sql_upd_header = f"""update journals_orders_headers jah
# set (n_recipient, n_number, n_dt_invoice, n_supplier,
# 	 n_summ, n_nds, n_pos_numbers,
# 	 n_base, n_executor,
# 	 n_dt_change) =
# 	({int(n_recipient)}::bigint, '{str(n_number)}', '{n_dt_invoice}'::date, {int(n_supplier)}::bigint,
# 	(select total_sum from
# 		(select n_doc_id, sum((n_product->'n_total_summ')::numeric) as total_sum
# 		from journals_orders_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s2
# 	),
# 	(select vat_sum from
# 		(select n_doc_id, sum((n_product->'n_vats_summ')::numeric) as vat_sum
# 		from journals_orders_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s3
# 	),
# 	(select pos_sum from
# 		(select n_doc_id, sum((n_product->'n_amount')::numeric) as pos_sum
# 		 from journals_orders_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s1
# 	),
# 	'{n_base}'::text, (select n_id from ref_employees where n_name = '{n_exec}'::text),
# 	CURRENT_TIMESTAMP)
# where n_id = {int(n_id)}::bigint
# returning n_id
#         """
#         return sql_upd_header

#     def _make_sql_new_header(self, header):
#         n_state = header.get('n_state')
#         n_base = header.get('n_base')
#         n_recipient = header.get('n_recipient')
#         n_number = header.get('n_number')
#         n_dt_invoice = header.get('n_dt_document')
#         n_supplier = header.get('n_supplier')
#         n_id = header.get('n_id')
#         n_exec = header.get('n_executor')
#         sql_new_header = f"""insert into journals_orders_headers
# (n_state, n_number, n_dt_invoice,
#  n_summ, n_nds, n_pos_numbers, n_base,
#  n_supplier, n_recipient,
#  n_executor,
#  n_paid) values
# ({int(n_state)}, '{str(n_number)}', '{n_dt_invoice}'::date,
#  0, 0, 0, '{n_base}'::text,
#  {int(n_supplier)}::bigint, {int(n_recipient)}::bigint,
#  (select n_id from ref_employees where n_name = '{n_exec}'::text),
#  (select n_id from ref_paids where n_value = 'Нет'::text)
# )
# returning n_id
# """
#         self.parent._print(sql_new_header)
#         return sql_new_header

#     def _make_sql_del_body(self, doc_id):
#         sql = f"""update journals_orders_bodies set
# n_deleted = true
# where n_doc_id = {doc_id}::bigint and not n_deleted"""

#         return sql

#     def _make_sql_new_body(self, data, doc_id):
#         sql = []
#         for row in data.get('table'):
#             if not row.get('n_code'):
#                 continue
#             # self.parent._print(row)
#             json_row = {
#                 "n_product": int(row['n_prod_id']),
#                 "n_code": row['n_code'],
#                 "n_unit": "шт.",
#                 "n_amount": int(row['n_amount']),
#                 "n_price": int(row['n_price']),
#                 "n_novats_summ": int(row['n_novats_summ']),
#                 "n_vats_base": int(row['n_vats_base'].replace('НДС ', '').replace('%', '')),
#                 "n_vats_summ": int(row['n_vats_summ']),
#                 "n_total_summ": int(row['n_total_summ']),
#             }
#             json_row = json.dumps(json_row, ensure_ascii=False)
#             s = f"""insert into journals_orders_bodies
# (n_doc_id, n_product) values
# ({doc_id}::bigint, ('{json_row}')::jsonb)
# """
#             sql.append(s)
#         sql = ';\n'.join(sql)
#         return sql

#     def recalc_orders_body(self, *args, **kwargs):
#         t = time.time()
#         self.parent._print("*"*10, " recalc_orders_body ", "*"*10)
#         self.parent._print(args)
#         self.parent._print(kwargs)
#         self.parent._print("*"*10, " recalc_orders_body ", "*"*10)
#         doc_id = kwargs.get('doc_id')
#         if doc_id:
#             sql = f"""update journals_orders_headers jah
# set (n_summ,
#      n_nds,
#      n_pos_numbers,
# 	 n_dt_change) =
# 	(
# 	(select total_sum from
# 		(select n_doc_id, sum((n_product->'n_total_summ')::numeric) as total_sum
# 		from journals_orders_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s2
# 	),
# 	(select vat_sum from
# 		(select n_doc_id, sum((n_product->'n_vats_summ')::numeric) as vat_sum
# 		from journals_orders_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s3
# 	),
# 	(select pos_sum from
# 		(select n_doc_id, sum((n_product->'n_amount')::numeric) as pos_sum
# 		 from journals_orders_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s1
# 	),
# 	CURRENT_TIMESTAMP)
# where n_id = {int(doc_id)}::bigint
# returning n_id
#         """
#             res = self._execute(sql)
#         t1 = time.time() - t
#         res = self.parent._get_order_header(doc_id)
#         t2 = time.time() - t1 - t
#         answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
#         return answer


#     def save_orders_document(self, *args, **kwargs):
#         t = time.time()
#         self.parent._print("*"*10, " save_orders_document ", "*"*10)
#         self.parent._print(args)
#         self.parent._print(kwargs)
#         self.parent._print("*"*10, " save_orders_document ", "*"*10)
#         doc_data = kwargs.get('doc_data')
#         res = []
#         if doc_data:
#             header = doc_data.get('header', {})
#             n_id = header.get('n_id')
#             if n_id:
#                 doc_id = int(doc_data.get('header').get('n_id'))
#                 r_body = self._execute(self._make_sql_del_body(doc_id))
#                 r_body = self._execute(self._make_sql_new_body(doc_data, doc_id))
#                 r_head = self._execute(self._make_sql_upd_header(header))
#                 res = self.parent._get_order_header(n_id)
#             else:
#                 r_head = self._execute(self._make_sql_new_header(header))
#                 doc_id = r_head[0][0]
#                 r_body = self._execute(self._make_sql_new_body(doc_data, doc_id))
#                 r_h_update = self.recalc_orders_body(**{"user": "_service_acount", "doc_id": doc_id})
#                 res = r_h_update.get('data')

#         t1 = time.time() - t
#         t2 = time.time() - t1 - t
#         answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
#         return answer


#     def get_orders_document(self, *args, **kwargs):
#         t = time.time()
#         self.parent._print("*"*10, " get_orders_document ", "*"*10)
#         self.parent._print(args)
#         self.parent._print(kwargs)
#         self.parent._print("*"*10, " get_orders_document ", "*"*10)
#         doc_id = kwargs.get('doc_id')
#         ret = []
#         if doc_id:
#             sql = f"""select n_id,
# rp.c_name,
# jab.n_product->'n_code',
# jab.n_product->'n_unit',
# jab.n_product->'n_amount',
# jab.n_product->'n_price',
# jab.n_product->'n_novats_summ',
# rv.c_name,
# jab.n_product->'n_vats_summ',
# jab.n_product->'n_total_summ',
# rp.c_id

# from journals_orders_bodies jab
# join ref_products rp on (rp.c_id=(jab.n_product->'n_product')::bigint)
# join ref_vats rv on (rv.c_vat=(jab.n_product->'n_vats_base')::int)
# where jab.n_doc_id = {int(doc_id)}
# and not n_deleted
# order by jab.n_id
#             """
#             ret = self._execute(sql)
#         t1 = time.time() - t
#         res = []
#         for i, row in enumerate(ret):
#             r = {
#                 "row_num": i,
#                 "n_id": str(row[0]),
#                 "n_product": row[1],
#                 "n_code": row[2],
#                 "n_unit": row[3],
#                 "n_okei_code": "",
#                 "n_type_package": "",
#                 "n_amount_mass": "",
#                 "n_amount_b": "",
#                 "n_gross_weight": "",
#                 "n_amount": row[4],
#                 "n_price": row[5],
#                 "n_novats_summ": row[6],
#                 "n_vats_base": row[7],
#                 "n_vats_summ": row[8],
#                 "n_total_summ": row[9],
#                 "n_prod_id": str(row[10])
#             }
#             res.append(r)
#         t2 = time.time() - t1 - t
#         answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
#         return answer


    def __call__(self):

        return "Orders"


###############3
#новая шапка заказа
sql = """insert into journals_orders_headers
(n_state, n_supplier, n_filename,
	n_id_field, n_name,
	n_p_id, n_code, n_inn,
	n_dt_price, n_dt_create,
    n_number, n_dt_send, n_recipient,
	n_recipient_id, n_summ, n_pos_numbers,
    n_dt_recieved, n_comment)
values (
	1, 2018121495480000001, 'order51100-7733833655_sin11-20188453618.txt',
	'20188453618', '',
	'', '', '7733833655',
	'06.07.2020 15:36:02'::timestamp, '06.07.2020 15:36:02'::timestamp,
	'1', '06.07.2020 15:37:51'::timestamp, 'Тверь, Волоколамский пр-т., 13',
	'2006547488710000020', 153000, 3,
	current_timestamp, ''
	)"""
#новое тело заказа
sql = """insert into journals_orders_bodies (
n_doc_id, n_product) values
(2018931210910000001,
('{"n_code": "8766900", "n_amount": 5, "n_price": 12000,
	"n_product": "1000 ТРАВ крем д/рук Интенсивное увлажнение 75мл Первое Решение ООО",
	"n_man": "", "n_comment": "-1", "n_matrix": "554770"}')::jsonb
)"""

sql = """update journals_products_balance jpb1 set n_price_price = (select case
	when jpb.n_vat_included then (jpb.n_price*1.15)::int
	else ((jpb.n_price + jpb.n_vat)*1.15)::int
end as temp_price
from journals_products_balance jpb where jpb1.n_id = jpb.n_id)"""