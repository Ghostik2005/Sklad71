# coding: utf-8

import sys
import time
import json
import datetime

class RESTS:

    def __init__(self, parent):
        self.parent = parent

    def _execute(self, sql):
        return self.parent._execute(sql)



    def _set_where_get_data(self, params=None):
        inserts = ["jrh.n_recipient = (select n_partner_id from service_home_organization)", ]
        if params:
            # self.parent._print(params)
            n_number = params.get('n_number')
            n_state = params.get('n_state')
            n_dt_invoice = params.get('n_dt_invoice')
            n_recipient = params.get('n_recipient')
            n_summ = params.get('n_summ')
            n_nds = params.get('n_nds')
            n_pos_numbers = params.get('n_pos_numbers')
            n_executor = params.get('n_executor')
            n_base = params.get('n_base', '')
            n_dt_change = params.get('n_dt_change')
            if n_number:
                if n_number.startswith('='):
                    r = f"""jrh.n_number = '{n_number.replace('=', '')}'"""
                else:
                    r = f"""jrh.n_number like '{n_number}%'"""
                inserts.append(r)
            if n_state:
                r = f"""jrh.n_state = {int(n_state)}"""
                inserts.append(r)
            if n_dt_invoice:
                start = n_dt_invoice.get('start')
                end = n_dt_invoice.get('end')
                if start and end:
                    r = f"""(jrh.n_dt_invoice >= '{str(start)}' and jrh.n_dt_invoice <= '{str(end)}')"""
                    inserts.append(r)
                elif start:
                    r = f"""jrh.n_dt_invoice::date = '{str(start)}'::date"""
                    inserts.append(r)
            if n_recipient:
                r = f"""jrh.n_recipient in ({n_recipient})"""
                inserts.append(r)
            if n_summ:
                if n_summ.startswith('='):
                    r = f"""jrh.n_summ = {float(n_summ.replace('=', '').strip())*100}::int"""
                elif n_summ.startswith('>'):
                    r = f"""jrh.n_summ >= {float(n_summ.replace('>', '').strip())*100}::int"""
                elif n_summ.startswith('<'):
                    r = f"""jrh.n_summ <= {float(n_summ.replace('<', '').strip())*100}::int"""
                else:
                    r = f"""jrh.n_summ::text like  '{n_summ.strip()}%'"""
                inserts.append(r)
            if n_nds:
                if n_nds.startswith('='):
                    r = f"""jrh.n_nds = {float(n_nds.replace('=', '').strip())*100}::int"""
                elif n_nds.startswith('>'):
                    r = f"""jrh.n_nds >= {float(n_nds.replace('>', '').strip())*100}::int"""
                elif n_nds.startswith('<'):
                    r = f"""jrh.n_nds <= {float(n_nds.replace('<', '').strip())*100}::int"""
                else:
                    r = f"""jrh.n_nds::text like  '{n_nds.strip()}%'"""
                inserts.append(r)
            if n_pos_numbers:
                if n_pos_numbers.startswith('='):
                    r = f"""jrh.n_pos_numbers = {float(n_pos_numbers.replace('=', '').strip())}::int"""
                elif n_pos_numbers.startswith('>'):
                    r = f"""jrh.n_pos_numbers >= {float(n_pos_numbers.replace('>', '').strip())}::int"""
                elif n_pos_numbers.startswith('<'):
                    r = f"""jrh.n_pos_numbers <= {float(n_pos_numbers.replace('<', '').strip())}::int"""
                else:
                    r = f"""jrh.n_pos_numbers::text like  '{n_pos_numbers.strip()}%'"""
                inserts.append(r)
            if n_executor:
                r = f"""jrh.n_executor in ({n_executor})"""
                inserts.append(r)
            if n_base:
                r = f"""jrh.n_base like '%{n_base.strip()}%'"""
                inserts.append(r)
            if n_dt_change:
                start = n_dt_change.get('start')
                end = n_dt_change.get('end')
                if start and end:
                    r = f"""(jrh.n_dt_change >= '{str(start)}' and jrh.n_dt_change <= '{str(end)}')"""
                    inserts.append(r)
                elif start:
                    r = f"""jrh.n_dt_change::date = '{str(start)}'::date"""
                    inserts.append(r)
        where = 'where '+' and '.join(inserts) if inserts else ''
        return where

    def _set_order_get_data(self, field):
        if field == 'n_recipient':
            field = 'rec.n_name'
        elif field == 'n_executor':
            field = 'emp.n_name'
        else:
            field = f'jrh.{field}'
        return field

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

        sql = """select jrh.n_id, jrh.n_number, jrh.n_state, jrh.n_dt_invoice::date,
rec.n_name, jrh.n_summ, jrh.n_nds, jrh.n_pos_numbers, emp.n_name,
jrh.n_base, jrh.n_dt_change,
jrh.n_recipient, jrh.ctid
from journals_rests_headers jrh
join ref_partners rec on (jrh.n_recipient = rec.n_id)
join ref_employees emp on (jrh.n_executor = emp.n_id)
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
            # dt_invoice = datetime.datetime.strptime(row[3], "%Y-%m-%d")
            # row[3] = dt_invoice.strftime("%d-%m-%Y")
            r = {
                "row_num": i,
                "n_id": str(row[0]),
                "n_number": row[1],
                "n_state": row[2],
                "n_dt_invoice": row[3],
                "n_recipient": row[4],
                "n_summ": row[5],
                "n_nds": row[6],
                "n_pos_numbers": row[7],
                "n_executor": row[8],
                "n_base": row[9],
                "n_dt_change": row[10],
                "n_recipient_id": str(row[11])
            }
            # self.parent._print(r)
            ret.append(r)
        t2 = time.time() - t1 - t
        answer = {"pos": offset, "total_count": cou, "data": ret, "params": args,
                  "kwargs": kwargs, "timing": {"sql": t1, "process": t2},
                  }
        return answer

    def _make_sql_upd_header(self, header):
        n_base = header.get('n_base', '')
        n_recipient = header.get('n_recipient')
        n_number = header.get('n_number')
        n_dt_invoice = header.get('n_dt_document')
        n_id = header.get('n_id')
        n_exec = header.get('n_executor')
        sql_upd_header = f"""update journals_rests_headers jrh
set (n_recipient, n_number, n_dt_invoice,
	 n_summ, n_nds, n_pos_numbers,
	 n_base, n_executor,
	 n_dt_change) =
	({int(n_recipient)}::bigint, '{str(n_number)}', '{n_dt_invoice}'::date,
	(select total_sum from
		(select n_doc_id, sum((n_product->'n_total_summ')::numeric) as total_sum
		from journals_rests_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s2
	),
	(select vat_sum from
		(select n_doc_id, sum((n_product->'n_vats_summ')::numeric) as vat_sum
		from journals_rests_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s3
	),
	(select pos_sum from
		(select n_doc_id, sum((n_product->'n_amount')::numeric) as pos_sum
		 from journals_rests_bodies where n_doc_id = {int(n_id)}::bigint and not n_deleted group by n_doc_id) as s1
	),
	'{n_base}'::text, (select n_id from ref_employees where n_name = '{n_exec}'::text),
	CURRENT_TIMESTAMP)
where n_id = {int(n_id)}::bigint
returning n_id
        """
        return sql_upd_header

    def _make_sql_new_header(self, header):
        n_state = header.get('n_state')
        n_base = header.get('n_base', '')
        n_recipient = header.get('n_recipient')
        n_number = header.get('n_number')
        n_dt_invoice = header.get('n_dt_document')
        n_exec = header.get('n_executor')
        sql_new_header = f"""insert into journals_rests_headers
(n_state, n_number, n_dt_invoice,
 n_summ, n_nds, n_pos_numbers, n_base,
 n_recipient,
 n_executor) values
({int(n_state)}, '{str(n_number)}', '{n_dt_invoice}'::date,
 0, 0, 0, '{n_base}'::text,
 {int(n_recipient)}::bigint,
 (select n_id from ref_employees where n_name = '{n_exec}'::text)
)
returning n_id
"""
        self.parent._print(sql_new_header)
        return sql_new_header

    def _make_sql_del_body(self, doc_id):
        sql = f"""update journals_rests_bodies set
n_deleted = true
where n_doc_id = {doc_id}::bigint and not n_deleted"""

        return sql

    def _make_sql_new_body(self, data, doc_id):
        sql = []
        for row in data.get('table'):
            if not row.get('n_code'):
                continue
            # self.parent._print(row)
            json_row = {
                "n_product": int(row['n_prod_id']),
                "n_code": row['n_code'],
                "n_unit": "шт.",
                "n_amount": int(row['n_amount']),
                "n_price": int(row['n_price']),
                "n_novats_summ": int(row['n_novats_summ']),
                "n_vats_base": 0 if int(row['n_vats_summ']) == 0 else int(row['n_vats_base'].replace('НДС ', '').replace('%', '')),
                "n_vats_summ": int(row['n_vats_summ']),
                "n_total_summ": int(row['n_total_summ']),
                "n_consignment": row["n_consignment"]
            }
            json_row = json.dumps(json_row, ensure_ascii=False)
            s = f"""insert into journals_rests_bodies
(n_doc_id, n_product) values
({doc_id}::bigint, ('{json_row}')::jsonb)
"""
            sql.append(s)
        sql = ';\n'.join(sql)
        return sql

    def recalc_rests_body(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " recalc_rests_body ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " recalc_rests_body ", "*"*10)
        doc_id = kwargs.get('doc_id')
        if doc_id:
            sql = f"""update journals_rests_headers jrh
set (n_summ,
     n_nds,
     n_pos_numbers,
	 n_dt_change) =
	(
	(select total_sum from
		(select n_doc_id, sum((n_product->'n_total_summ')::numeric) as total_sum
		from journals_rests_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s2
	),
	(select vat_sum from
		(select n_doc_id, sum((n_product->'n_vats_summ')::numeric) as vat_sum
		from journals_rests_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s3
	),
	(select pos_sum from
		(select n_doc_id, sum((n_product->'n_amount')::numeric) as pos_sum
		 from journals_rests_bodies where n_doc_id = {int(doc_id)}::bigint and not n_deleted group by n_doc_id) as s1
	),
	CURRENT_TIMESTAMP)
where n_id = {int(doc_id)}::bigint
returning n_id
        """
            res = self._execute(sql)
        t1 = time.time() - t
        res = self.parent._get_rest_header(doc_id)
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def save_rests_document(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " save_rests_document ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " save_rests_document ", "*"*10)
        doc_data = kwargs.get('doc_data')
        res = []
        if doc_data:
            header = doc_data.get('header', {})
            n_id = header.get('n_id')
            if n_id:
                doc_id = int(doc_data.get('header').get('n_id'))
                r_body = self._execute(self._make_sql_del_body(doc_id))
                r_body = self._execute(self._make_sql_new_body(doc_data, doc_id))
                r_head = self._execute(self._make_sql_upd_header(header))
                res = self.parent._get_rest_header(n_id)
            else:
                r_head = self._execute(self._make_sql_new_header(header))
                doc_id = r_head[0][0]
                r_body = self._execute(self._make_sql_new_body(doc_data, doc_id))
                r_h_update = self.recalc_rests_body(**{"user": "_service_acount", "doc_id": doc_id})
                res = r_h_update.get('data')

        t1 = time.time() - t
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def get_rests_document(self, *args, **kwargs):
        t = time.time()
        self.parent._print("*"*10, " get_rests_document ", "*"*10)
        self.parent._print(args)
        self.parent._print(kwargs)
        self.parent._print("*"*10, " get_rests_document ", "*"*10)
        doc_id = kwargs.get('doc_id')
        ret = []
        if doc_id:
            sql = f"""select n_id,
rp.c_name,
jrb.n_product->'n_code',
jrb.n_product->'n_unit',
jrb.n_product->'n_amount',
jrb.n_product->'n_price',
jrb.n_product->'n_novats_summ',
rv.c_name,
jrb.n_product->'n_vats_summ',
jrb.n_product->'n_total_summ',
rp.c_id,
jrb.n_product->'n_consignment'

from journals_rests_bodies jrb
join ref_products rp on (rp.c_id=(jrb.n_product->'n_product')::bigint)
join ref_vats rv on (rv.c_vat=(jrb.n_product->'n_vats_base')::int)
where jrb.n_doc_id = {int(doc_id)}
and not n_deleted
order by jrb.n_id
            """
            ret = self._execute(sql)
        t1 = time.time() - t
        res = []
        for i, row in enumerate(ret):
            r = {
                "row_num": i,
                "n_id": str(row[0]),
                "n_product": row[1],
                "n_code": row[2],
                "n_unit": row[3],
                "n_okei_code": "",
                "n_type_package": "",
                "n_amount_mass": "",
                "n_amount_b": "",
                "n_gross_weight": "",
                "n_amount": row[4],
                "n_price": row[5],
                "n_novats_summ": row[6],
                "n_vats_base": row[7],
                "n_vats_summ": row[8],
                "n_total_summ": row[9],
                "n_prod_id": str(row[10]),
                "n_consignment": row[11]
            }
            res.append(r)
        t2 = time.time() - t1 - t
        answer = {"data": res, "params": args, "kwargs": kwargs, "timing": {"sql": t1, "process": t2}}
        return answer


    def __call__(self):

        return "Rests"
